import { useEffect, useState } from 'react'
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import { Mesh, Group, BufferGeometry, NormalBufferAttributes, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { ProxyMeshProperties } from '../../../contexts/ProxyMeshContext';
import AnnotationController from '../controller/AnnotationController';
import AnnotationViewer from '../../../components/viewer/AnnotationViewer';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import './AnnotationManager.css';

export type IntersectionPayload = {
	face: {a: number, b: number, c: number, normal: Vector3} | null,
	faceIndex: number | null
}

export default function AnnotationManager() {
    const { task } = useTaskContext();
    const { dispatch } = useProxyMeshContext();
    const { user } = useAuthContext();
    const [selectedIndex, setSelectedIndex] = useState<IntersectionPayload | null>(null);

    const getGeometry = (group: Group) => {
        const mesh = group.children[0].children[0] as Mesh;
        return mesh.geometry as BufferGeometry<NormalBufferAttributes>;
    }

    const getMaterial = (group: Group) => {
        const mesh = group.children[0].children[0] as Mesh;
        return mesh.material
    }

    const loadMesh = async () => {
        try {
            if (!task) return;

            /* Load glb file into ref */
            const loader = new GLTFLoader();
            const response = await fetch(`${config.STATICS_URL}/${task?.meshPath}`, {
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

            dispatch({ type: 'SET_PROXY_MESH', payload: { geometry, material } as ProxyMeshProperties });

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadMesh();
    }, [task]);

    return (
        <div className='annotation-manager-container'>
            <AnnotationController selectIndexHandler={setSelectedIndex}/>
            <AnnotationViewer selectedIndex={selectedIndex}/>
        </div>
    )
}
