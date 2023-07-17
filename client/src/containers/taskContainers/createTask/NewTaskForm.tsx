import React, { useState, useEffect, useRef } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import './NewTaskForm.css';
import { config } from '../../../utils/config';
import { useAuthContext } from '../../../hooks/useAuthContext';

type NewTaskFormProps = {
  projectId: string;
};

type TaskFormData = {
  name: string;
  model: FileList | null;
};

type ProcessedFormData = {
    name: string;
    model: File | null;
};

type ModelData = {
    modelPath: string;
    texturePath: string;
};

interface  ModelPreviewProps {
    modelPath: string;
    texturePath: string;
    onModelConverted: (glbFile: File) => void;
};
  
function ModelPreview( props : ModelPreviewProps): JSX.Element {

    const groupRef = useRef<Group>(null);
    // TODO: implement different model formats  (e.g. gltf)
    const obj = useLoader(OBJLoader, props.modelPath);
    const texture = useLoader(TextureLoader, props.texturePath);
    const exporter = new GLTFExporter();

    // Replace the texture of all materials in the loaded model
    // TODO: find a better way to do this, only works on single mesh models
    obj.traverse((child) => {
        if (child instanceof Mesh) {
            child.material.side = 2;
            child.material.map = texture;
            child.material.needsUpdate = true;
        }
    });

    useEffect(() => {
        exporter.parse(
            obj,
            (gltf) => {
                const blob = new Blob([gltf as BlobPart], { type: 'application/octet-stream' });
                const glbFile = new File([blob], `${props.modelPath}.glb`, { type: 'model/gltf-binary' });
                props.onModelConverted(glbFile);
            }, 
            (error) => { console.error(error); },
            { binary: true }
        );
      }, [props.modelPath]);
    
    return (
        <group ref={groupRef}>
            <primitive object={obj}/>
        </group>
    );
}

export default function NewTaskForm(props: NewTaskFormProps) {
    const { user } = useAuthContext();
    const [formData, setFormData] = useState<TaskFormData>({
        name: '',
        model: null
    });

    const [processedFormData, setProcessedFormData] = useState<ProcessedFormData>({
        name: '',
        model: null
    });

    const [previewModelData, setPreviewModelData] = useState<ModelData>({
        modelPath: "",
        texturePath: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.files ? e.target.files : e.target.value });
    }

    function handleModelConverted(glbFile: File) {
        setProcessedFormData((prevFormData) => ({
            ...prevFormData,
            model: glbFile
        }));
    }

    function downloadModel() {
        if (processedFormData.model) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(processedFormData.model);
            link.download = processedFormData.model.name;
            link.click();
        }
    }

    useEffect(() => {
        if (formData.model) {
            const files = Array.from(formData.model);
            const previewModel: ModelData = {
                modelPath: "",
                texturePath: ""
            }
            for (let file of files) {
                const extension = file.name.split('.').pop();
                if (extension === 'obj')
                    previewModel.modelPath = URL.createObjectURL(file as File);
                if (['png', 'jpg', 'jpeg'].includes(extension as string))
                    previewModel.texturePath = URL.createObjectURL(file as File);
            }
            setPreviewModelData(previewModel);
        }
      }, [formData.model]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(props.projectId);
        try {
            if (processedFormData.model) {
                const outFormData = new FormData();
                outFormData.append('name', formData.name);
                outFormData.append('model', processedFormData.model);
                outFormData.append('project', props.projectId);
                fetch(`${config.API_URL}/tasks/`, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    },
                    method: 'POST',
                    body: outFormData
                });
            }
        } catch (error) {
            console.error(error);
        }
    }


  return (
    <div className='task-form'>
        <h4>New Task</h4>
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' name='name' onChange={handleChange} />
        </div>
        <div>
            <label htmlFor='model'>Mesh Model</label>
            <input type='file' id='model' name='model' onChange={handleChange} multiple />
        </div>
        { previewModelData.modelPath !== "" ? 
        <Canvas camera={{position: [0, 1, 1]}}>
            <color attach="background" args={['#f5efe6']} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <ModelPreview 
                modelPath={previewModelData.modelPath}
                texturePath={previewModelData.texturePath}
                onModelConverted={handleModelConverted}
            />
        </Canvas>
        : null}
        { processedFormData.model ? <button type='button' onClick={downloadModel}>Download</button> : null}
        <button disabled={processedFormData.model === null} type='submit'>Create</button>
        </form>
    </div>
  );
}


