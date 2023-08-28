import { useState, useEffect, useRef } from 'react'
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import { Mesh, Group, Vector3, BufferGeometry, NormalBufferAttributes, Material, BufferAttribute } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { radialUnwrap } from '../../../utils/radialUnwrap';
import { flattenAxis } from '../../../utils/flattenAxis';
import { Socket, io, } from 'socket.io-client';
import AnnotationController from '../controller/AnnotationController';
import AnnotationViewer from '../viewer/AnnotationViewer';
import './AnnotationManager.css';

export type IntersectionPayload = {
	face: {a: number, b: number, c: number, normal: Vector3} | null,
	faceIndex: number | null
}

export default function AnnotationManager() {
    const { task, loading: loadingTask } = useTaskContext();
    const { loading: loadingMesh, dispatch: dispatchProxyMesh } = useProxyMeshContext();
    const { user } = useAuthContext();
    const [ready, setReady] = useState<boolean>(false);
    const socket = useRef<Socket<any> | null>(null);

    const getGeometry = (group: Group) => {
        const mesh = group.children[0].children[0] as Mesh;
        return mesh.geometry
    }

    const getMaterial = (group: Group) => {
        const mesh = group.children[0].children[0] as Mesh;
        return mesh.material
    }

    const unwrapMesh = async (geometry: BufferGeometry<NormalBufferAttributes> , unwrapAxis: 'x' | 'y' | 'z') => {
        return new Promise<BufferGeometry<NormalBufferAttributes> | null>((resolve) => {
            if (!geometry) {
                resolve(null);
                return;
            }


            const unwrappedGeometry = geometry.clone();
            const unwrappedPositionsNotFlattened = radialUnwrap(
                Array.from(geometry.attributes.position.array),
                unwrapAxis
            );
            const unwrappedPositions = flattenAxis(unwrappedPositionsNotFlattened, 'x', 0.05);
            const positionsBufferAttribute = new BufferAttribute(new Float32Array(unwrappedPositions), 3);

            unwrappedGeometry.setAttribute('position', positionsBufferAttribute);
            unwrappedGeometry.rotateX(Math.PI / 2);
            unwrappedGeometry.rotateY(-Math.PI / 2);
            unwrappedGeometry.translate(0, 2, 0);
            unwrappedGeometry.setIndex(geometry.index);
            unwrappedGeometry.computeBoundsTree();
            unwrappedGeometry.computeVertexNormals();
            unwrappedGeometry.computeTangents();

            resolve(unwrappedGeometry);
        });
    };

    const loadMesh = async (shouldUnwrap: boolean) => {
        try {
            if (!task) return;

            dispatchProxyMesh({ type: 'SET_LOADING', payload: true });

            /* Load glb file into ref */
            const loader = new GLTFLoader();
            const response = await fetch(`${config.STATICS_URL}/${task.meshPath}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
    
            if (!response.ok) {
                dispatchProxyMesh({ type: 'SET_LOADING', payload: false });
                throw new Error('Failed to load mesh');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const gltf = await loader.loadAsync(url);

            const geometry = getGeometry(gltf.scene);
            const material = getMaterial(gltf.scene);

            dispatchProxyMesh({ type: 'SET_PROXY_GEOMETRY', payload: geometry });
            dispatchProxyMesh({ type: 'SET_PROXY_MATERIAL', payload: material as Material });

            if (!shouldUnwrap) {
                dispatchProxyMesh({ type: 'SET_UNWRAPPED_GEOMETRY', payload: geometry.clone() });
            }

            else {
                const unwrappedGeometry = await unwrapMesh(geometry, 'y');
                dispatchProxyMesh({ type: 'SET_UNWRAPPED_GEOMETRY', payload: unwrappedGeometry });
            }


            dispatchProxyMesh({ type: 'SET_LOADING', payload: false });

        } catch (error) {
            console.error(error);
            dispatchProxyMesh({ type: 'SET_LOADING', payload: false });
        }
    };

    useEffect(() => {
        loadMesh(true);
    }, [task?.meshPath]);

    useEffect(() => {
        setReady(!loadingTask && !loadingMesh);
    }, [loadingTask, loadingMesh]);

    useEffect(() => {
        socket.current = io(config.SOCKET_URL, { transports: ['websocket'] });

        return () => {
            socket.current?.disconnect();
        }
    }, [task]);

    return (
        <div className='annotation-manager-container'>
            { !ready ? <div className='loading-container'> Loading... </div> :
                <>
                    <AnnotationController />
                    <AnnotationViewer />
                </>
            }
        </div>
    )
}
