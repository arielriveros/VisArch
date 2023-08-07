import { useEffect, useState } from 'react'
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import { Mesh, Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { ProxyMeshProperties } from '../../../contexts/ProxyMeshContext';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import AnnotationController from '../controller/AnnotationController';
import AnnotationViewer from '../../../components/viewer/AnnotationViewer';
import './AnnotationManager.css';

export type IntersectionPayload = {
	face: {a: number, b: number, c: number, normal: Vector3} | null,
	faceIndex: number | null
}

export default function AnnotationManager() {
    const { task, dispatch: dispatchTask } = useTaskContext();
    const { dispatch: dispatchProxyMesh } = useProxyMeshContext();
    const { user } = useAuthContext();
    const [hoveredIndex, setHoveredIndex] = useState<IntersectionPayload | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getGeometry = (group: Group) => {
        const mesh = group.children[0].children[0] as Mesh;
        return mesh.geometry
    }

    const getMaterial = (group: Group) => {
        const mesh = group.children[0].children[0] as Mesh;
        return mesh.material
    }

    const loadMesh = async () => {
        try {
            if (!task) return;

            setLoading(true);

            /* Load glb file into ref */
            const loader = new GLTFLoader();
            const response = await fetch(`${config.STATICS_URL}/${task.meshPath}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
    
            if (!response.ok)
                throw new Error('Failed to load mesh');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const gltf = await loader.loadAsync(url);

            const geometry = getGeometry(gltf.scene);
            const material = getMaterial(gltf.scene);

            dispatchProxyMesh({ type: 'SET_PROXY_MESH', payload: { geometry, material } as ProxyMeshProperties });

            setLoading(false);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMesh();
    }, [task?.meshPath]);

    const selectIndicesHandler = (indices: number[]) => {
        dispatchTask({ type: 'ADD_PATTERN_ENTITY', payload: { patternIndices: indices } });
    }

    return (
        <div className='annotation-manager-container'>
            {loading && <div className='loading-container'> Loading... </div>}
            <AnnotationController 
                hoverIndexHandler={setHoveredIndex}
                selectIndicesHandler={selectIndicesHandler}
            />
            <AnnotationViewer selectedIndex={hoveredIndex}/>
        </div>
    )
}
