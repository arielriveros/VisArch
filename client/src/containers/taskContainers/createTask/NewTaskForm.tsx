import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { config } from '../../../utils/config';
import { useAuthContext } from '../../../hooks/useAuthContext';
import MeshInput from '../../../components/inputs/mesh/MeshInput';
import './NewTaskForm.css';

type NewTaskFormProps = {
  projectId: string;
};

type TaskFormData = {
  name: string;
  model: File | null;
};

type ModelData = {
    modelPath: string;
    texturePath: string;
};

export default function NewTaskForm(props: NewTaskFormProps) {
    const { user } = useAuthContext();
    const [formData, setFormData] = useState<TaskFormData>({
        name: '',
        model: null
    });

    const [modelFiles, setModelFiles] = useState<FileList | null>(null);

    const [previewModelData, setPreviewModelData] = useState<ModelData>({
        modelPath: "",
        texturePath: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name === 'model')
            setModelFiles(e.target.files);
        else
            setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleModelConverted(glbFile: File) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            model: glbFile
        }));
    }

    useEffect(() => {
        if (modelFiles) {
            const files = Array.from(modelFiles);
            for (let file of files) {
                const extension = file.name.split('.').pop();
                if (extension === 'obj')
                    setPreviewModelData((prevModelData) => ({
                        ...prevModelData,
                        modelPath: URL.createObjectURL(file as File)
                    }));
                if (['png', 'jpg', 'jpeg'].includes(extension as string))
                    setPreviewModelData((prevModelData) => ({
                        ...prevModelData,
                        texturePath: URL.createObjectURL(file as File)
                    }));
            }
        }
      }, [modelFiles]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            if (formData.model) {
                const outFormData = new FormData();
                outFormData.append('name', formData.name);
                outFormData.append('model', formData.model);
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
                <color attach="background" args={['black']} />
                <ambientLight />
                <MeshInput 
                    modelPath={previewModelData.modelPath}
                    texturePath={previewModelData.texturePath}
                    onModelConverted={handleModelConverted}
                />
            </Canvas>
            : null}
            <button disabled={formData.model === null} type='submit'>Create</button>
            </form>
        </div>
  );
}


