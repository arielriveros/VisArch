import React, { useState, useEffect } from 'react'
import TextInput from '../../../components/inputs/text/TextInput';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { API_ENDPOINT } from '../../../api/Endpoints';
import './NewProjectForm.css'

type NewProjectFormData = {
    projectName: string;
    projectDescription: string;
    members: string[];
    class: 'object' | 'terrain';
}

interface MinUser {
    _id: string;
    username: string;
    email: string;
}

export default function NewProjectForm(props: {onAddProject:()=>void, onExit: ()=>void}): JSX.Element {
    const { user } = useAuthContext();

    const [formData, setFormData] = useState<NewProjectFormData>({
        projectName: '',
        projectDescription: '',
        class: 'object',
        members: []
    })

    const [searchMember, setSearchMember] = useState<string>('');
    const [members, setMembers] = useState<string[]>([]);
    const [users, setUsers] = useState<MinUser[] | null>(null);
    const [filteredMembers, setFilteredMembers] = useState<MinUser[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        if (!users) return;

        const filteredUsers = users.filter((u: MinUser) => {
            return u.username.toLowerCase().includes(searchMember.toLowerCase()) || u.email.toLowerCase().includes(searchMember.toLowerCase());
        })
        // remove the users that are already members
        .filter((u: MinUser) => {
            return !members.includes(u.username);
        })

        // remove self from the list
        .filter((u: MinUser) => {
            return u.username !== user?.username;
        })
        setFilteredMembers(filteredUsers);
    }, [members, searchMember])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleNewMember = (e: React.ChangeEvent<HTMLInputElement>) => {
        // TODO: Validate if the user exists
        const { value } = e.target;
        setSearchMember(value);
    }

    const getUsers = async () => {
        try {
            const res = await fetch(`${API_ENDPOINT()}/user/`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const data = await res.json();
            setUsers(data);
        }
        catch (err) { console.error(err) }
    }

    const addMember = (username: string) => {
        setMembers(prevState => [...prevState, username]);
        setSearchMember(''); // Reset the value of the "newMember" state
        setFilteredMembers([]); // Reset the filtered members
        setFormData(prevState => ({
            ...prevState,
            members: [...prevState.members, username]
        }));
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                members: formData.members,
                class: formData.class
            }
        )

        try {
            await fetch(`${API_ENDPOINT()}/projects/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: body
            });
            props.onAddProject();
        }

        catch (err) { console.error(err) }
    }

    return (
        <div className='ProjectFormContainer'>
            <div className='ProjectForm'>
                <h3> Create New Project</h3>
                <form onSubmit={submit}>
                    <div className='FormGroup'>
                        <TextInput targetName="projectName" type="text" label="Project Name"  handleInput={handleInput}/>
                        <br />
                        <div className='ClassSelector'>
                            <div>
                                Class:
                            </div>    
                            <div>
                                Object <input type="radio" name="class" value="object" checked={formData.class === 'object'} onChange={handleInput}/>
                                Terrain <input type="radio" name="class" value="terrain" checked={formData.class === 'terrain'} onChange={handleInput}/>
                            </div> 
                        </div>
                        <br />
                        <TextInput targetName="projectDescription" type="text" label="Project Description"  handleInput={handleInput}/>
                        <br />
                        <div className='MembersFinder'>
                            <TextInput targetName="members" type="text" label="Add Member" text="Search User" handleInput={handleNewMember}/>
                            {
                                searchMember ?
                                <div className='UsersDropdownContainer' >
                                    <div className='UsersDropdown'>
                                        {users && filteredMembers.map((m: MinUser) => (
                                            <div className='Item' onClick={(e)=>{addMember(m.username)}}>
                                                <div className='Name'> {m.username} </div>
                                                {m.email !== "" && <div className='Email'> {'\u200A'} ({m.email}) </div>}
                                            </div>
                                        ))}
                                    </div> 
                                </div>
                                : null
                            }
                            <div className='MembersContainer'>
                                {members.map((m: string) => (
                                    <div className='Member'>
                                        <p>{m}</p>
                                        <button onClick={(e)=>{setMembers(prevState => prevState.filter((member: string) => member !== m))}}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className='ButtonGroup'>
                        <button className='submit-btn' type='submit'>Create Project</button>
                        <button className='cancel-btn' onClick={props.onExit}>Cancel</button>
                    </ div>
                </form>
                {error && <p className='error'>{error}</p>}
            </div>
        </div>
    )
}
