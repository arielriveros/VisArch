import React, { useState } from 'react'
import TextInput from '../../../components/inputs/text/TextInput';
import { config } from '../../../utils/config';
import './NewProjectForm.css'
import { useAuthContext } from '../../../hooks/useAuthContext';

type NewProjectFormData = {
    projectName: string;
    projectDescription: string;
    members: string[];
}

export default function NewProjectForm(props: {onExit: ()=>void}): JSX.Element {
    const { user } = useAuthContext();

    const [formData, setFormData] = useState<NewProjectFormData>({
        projectName: '',
        projectDescription: '',
        members: []
    })

    const [newMember, setNewMember] = useState<string>('');
    const [members, setMembers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleNewMember(e: React.ChangeEvent<HTMLInputElement>) {
        // TODO: Validate if the user exists
        const { value } = e.target;
        setNewMember(value);
    }

    function addMember(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setMembers(prevState => [...prevState, newMember]);
        setNewMember(''); // Reset the value of the "newMember" state
        setFormData(prevState => ({
            ...prevState,
            members: [...prevState.members, newMember]
        }));
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if(formData.projectName === '') {
            setError('Project name is required');
            return;
        }

        const body = JSON.stringify(
            {
                name: formData.projectName,
                description: formData.projectDescription,
                owner: user?.username,
                members: formData.members
            }
        )
        const res = await fetch(`${config.API_URL}/projects/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            },
            body: body
        });
        const data = await res.json();
        console.log(data);
        props.onExit();
    }

    return (
        <div className='project-form'>
            <h5> Create New Project</h5>
            <form onSubmit={submit}>
                <div className='form-group'>
                    <TextInput targetName="projectName" type="text" label="Project Name"  handleInput={handleInput}/>
                    <TextInput targetName="projectDescription" type="text" label="Project Description"  handleInput={handleInput}/>
                    <div className='members'>
                        <ul>
                            {members.map((member, index) => <li key={index}>{member}</li>)}
                        </ul>
                    </div>
                    <div className='add-member'>
                        <TextInput targetName="members" type="text" label="Add Member"  handleInput={handleNewMember}/>
                        <button className='add-member-btn' value={newMember} onClick={addMember}>Add</button>
                    </div>
                </div>
                <button className='submit-btn' type='submit'>Create Project</button>
                <button className='cancel-btn' onClick={props.onExit}>Cancel</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    )
}
