import { useEffect, useState } from 'react'
import AnnotationViewer from '../viewer/AnnotationViewer'
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './AnnotationManager.css';
import { useAuthContext } from '../../../../../hooks/useAuthContext';

export default function AnnotationManager() {
    const { task, dispatch } = useTaskContext();
    const { user } = useAuthContext();
    const [mesh, setMesh] = useState<Group | null>(null);

    const loadMesh = async () => {
        try {
            if (!task) return;

            /* Load glb file into ref */
            const loader = new GLTFLoader();
            const response = await fetch(`${config.BACKEND_URL}/${task?.meshPath}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
    
            if (!response.ok)
                throw new Error('Failed to load mesh');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const gltf = await loader.loadAsync(url);
            setMesh(gltf.scene);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadMesh();
    }, [task]);

    return (
        <div className='annotation-manager-container'>
            <AnnotationViewer mesh={mesh}/>
        </div>
    )
}
