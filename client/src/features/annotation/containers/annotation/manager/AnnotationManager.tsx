import { useState, useEffect } from 'react'
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import { Mesh, Group, Vector3, BufferGeometry, NormalBufferAttributes, Material, BufferAttribute } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useSocket } from '../../../../socket/hooks/useSocket';
import { radialUnwrap } from '../../../utils/radialUnwrap';
import { flattenAxis } from '../../../utils/flattenAxis';
import AnnotationController from '../controller/AnnotationController';
import AnnotationViewer from '../viewer/AnnotationViewer';
import useTaskDispatcher from '../../../../taskDispatcher';
import './AnnotationManager.css';

export type IntersectionPayload = {
	face: {a: number, b: number, c: number, normal: Vector3} | null,
	faceIndex: number | null
}

export default function AnnotationManager() {
    const { task, dispatch, loading: loadingTask, class: projectClass } = useTaskContext();
    const { loading: loadingMesh, dispatch: dispatchProxyMesh } = useProxyMeshContext();
    const { user } = useAuthContext();
    const { socket, emit, roomId } = useSocket();
    const DISPATCH = useTaskDispatcher();
    const [ready, setReady] = useState<boolean>(false);

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
                const originalGeometry = geometry.clone();
                originalGeometry.computeBoundsTree();

                dispatchProxyMesh({ type: 'SET_UNWRAPPED_GEOMETRY', payload: originalGeometry });
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
        loadMesh(projectClass === 'object');
    }, [task?.meshPath]);

    useEffect(() => {
        setReady(!loadingTask && !loadingMesh);
    }, [loadingTask, loadingMesh]);

    useEffect(() => {
        if(!socket) return;

        socket.on('BROADCAST::ADD_PATTERN_ARCHETYPE', (name: any) => {
            DISPATCH.ADD_PATTERN_ARCHETYPE(name, false);
        });

        socket.on('BROADCAST::REMOVE_PATTERN_ARCHETYPE', (name: any) => {
            DISPATCH.REMOVE_PATTERN_ARCHETYPE(name, false);
        });

        socket.on('BROADCAST::ADD_PATTERN_ENTITY', (data: any) => {
            DISPATCH.ADD_PATTERN_ENTITY(data.archetypeName, data.patternIndices, data.name, false);
        });

        socket.on('BROADCAST::REMOVE_PATTERN_ENTITY', (data: any) => {
            DISPATCH.REMOVE_PATTERN_ENTITY(data.patternArchetypeName, data.patternEntityName, false);
        });

        socket.on('BROADCAST::UPDATE_PATTERN_ENTITY_PROPERTIES', (data: any) => {
            DISPATCH.UPDATE_PATTERN_ENTITY_PROPERTIES(data.patternArchetypeName, data.patternEntityName, data.entityProperties, false);
        });

        socket.on('BROADCAST::UPDATE_PATTERN_ARCHETYPE_LABEL', (data: any) => {
            DISPATCH.UPDATE_PATTERN_ARCHETYPE_LABEL(data.patternArchetypeName, data.label, false);
        });

        socket.on('BROADCAST::JOIN', () => {
            if (task && user)
                emit('SHARE_ANNOTATIONS_ON_JOIN', { task, roomId });
        });

        socket.on('BROADCAST::SHARE_ANNOTATIONS_ON_JOIN', (data: any) => {
            dispatch({ type: 'SET_ANNOTATIONS', payload: data.task.annotations });
        });

        return () => {
            socket.off('BROADCAST::ADD_PATTERN_ARCHETYPE');
            socket.off('BROADCAST::REMOVE_PATTERN_ARCHETYPE');
            socket.off('BROADCAST::ADD_PATTERN_ENTITY');
            socket.off('BROADCAST::REMOVE_PATTERN_ENTITY');
            socket.off('BROADCAST::UPDATE_PATTERN_ENTITY_PROPERTIES');
            socket.off('BROADCAST::UPDATE_PATTERN_ARCHETYPE_LABEL');
            socket.off('BROADCAST::JOIN');
            socket.off('BROADCAST::SHARE_ANNOTATIONS_ON_JOIN');
        }
    }, [socket, task, ready]);

    return (
        <div className='annotation-manager-container'>
            { !ready ? <div className='loading-container'> Loading... </div> :
                <>
                    <AnnotationController />
                    {projectClass === 'object' && <AnnotationViewer />}
                </>
            }
        </div>
    )
}
