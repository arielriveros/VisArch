import { useEffect, useState } from 'react'
import AnnotationViewer from '../viewer/AnnotationViewer'
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './AnnotationManager.css';

export default function AnnotationManager() {
    const { task, dispatch } = useTaskContext();
    const [mesh, setMesh] = useState<Group | null>(null);

    const loadMesh = async () => {
        try {
            if (!task) return;
            /* Load glb file into ref */
            const loader = new GLTFLoader();
            const gltf = await loader.loadAsync(`${config.BACKEND_URL}/${task?.meshPath}`);
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
