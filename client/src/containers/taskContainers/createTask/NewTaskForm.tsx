import React, { useState, useEffect } from 'react';
import { config } from '../../../utils/config';
import { useAuthContext } from '../../../hooks/useAuthContext';
import MeshInput from '../../../components/inputs/mesh/MeshInput';
import './NewTaskForm.css';

type NewTaskFormProps = {
    projectId: string;
    handleNewTask: (task: {_id: string}) => void;
};

type TaskFormData = {
  name: string;
  model: File | null;
};

export default function NewTaskForm(props: NewTaskFormProps) {
    const { user } = useAuthContext();
    const [formData, setFormData] = useState<TaskFormData>({
        name: '',
        model: null
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleMeshInput = (glbFile: File) => {
        setFormData((prev) => ({ ...prev, model: glbFile }));
    } 

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (formData.model) {
                const outFormData = new FormData();
                outFormData.append('name', formData.name);
                outFormData.append('model', formData.model);
                outFormData.append('project', props.projectId);
                const response = await fetch(`${config.API_URL}/tasks/`, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    },
                    method: 'POST',
                    body: outFormData
                });
                const data = await response.json();
                props.handleNewTask({_id: data._id});
            }
        } catch (error) {
            console.error(error);
        }
    }

    const downloadGLB = () => {
        if(!formData.model) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(formData.model);
        link.download = formData.model.name;
        link.click();
    }

    return (
        <div className='task-form'>
            <h4>New Task</h4>
            <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='name'>Name</label>
                <input type='text' id='name' name='name' onChange={handleChange} />
            </div>
            <MeshInput meshHandler={handleMeshInput} />
            <button disabled={formData.model === null} onClick={downloadGLB}>Download</button>
            <button disabled={formData.model === null} type='submit'>Create</button>
            </form>
        </div>
  );
}


