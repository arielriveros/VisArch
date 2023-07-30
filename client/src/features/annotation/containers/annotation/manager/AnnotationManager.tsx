import { useEffect, useState } from 'react'
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import { Mesh, Group, BufferGeometry, NormalBufferAttributes, BufferAttribute, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import './AnnotationManager.css';
import AnnotationController from '../controller/AnnotationController';
import AnnotationViewer from '../../../components/viewer/AnnotationViewer';

export type ProxyMeshProperties = {
    geometry?: BufferGeometry<NormalBufferAttributes>;
    material: any;
}

export type IntersectionPayload = {
	face: {a: number, b: number, c: number, normal: Vector3} | null,
	faceIndex: number | null
}

export default function AnnotationManager() {
    const { task, dispatch } = useTaskContext();
    const { user } = useAuthContext();
    const [proxyMesh, setProxyMesh] = useState<ProxyMeshProperties | null>(null);
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

            setProxyMesh({
                geometry,
                material
            });

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadMesh();
    }, [task]);

    return (
        <div className='annotation-manager-container'>
            <AnnotationController geometry={proxyMesh?.geometry} material={proxyMesh?.material} selectIndexHandler={setSelectedIndex}/>
            <AnnotationViewer geometry={proxyMesh?.geometry} material={proxyMesh?.material} selectedIndex={selectedIndex}/>
        </div>
    )
}
