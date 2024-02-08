import { useState, ChangeEvent, FormEvent } from 'react';
import { useAuthContext } from 'features/authentication/hooks/useAuthContext';
import { Project } from 'common/api/ModelTypes';
import { API_ENDPOINT } from 'common/api/Endpoints';
import MeshInput from 'features/projectManagement/containers/createTask/MeshInput';
import './NewTaskForm.css';

type NewTaskFormProps = {
    project: Project;
    setShowForm: (show: boolean) => void;
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


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleMeshInput = (glbFile: File) => {
        setFormData((prev) => ({ ...prev, model: glbFile }));
    } 

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (formData.model) {
                const outFormData = new FormData();
                outFormData.append('name', formData.name);
                outFormData.append('model', formData.model);
                outFormData.append('project', props.project._id);
                const response = await fetch(`${API_ENDPOINT()}/tasks/`, {
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
            <MeshInput meshHandler={handleMeshInput} projectClass={props.project.class} />
            <button disabled={formData.model === null} onClick={downloadGLB}>Download</button>
            <button disabled={formData.model === null} type='submit'>Create</button>
            <button onClick={() => props.setShowForm(false)}>Cancel</button>
            </form>
        </div>
  );
}


