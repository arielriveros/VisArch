import { useState, useEffect } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext';
import { config } from '../../../utils/config';
import { Project } from '../../../api/ModelTypes';
import ProjectItem from './ProjectItem';
import './ProjectsList.css'
import NewProjectForm from '../createProject/NewProjectForm';

export default function ProjectsList(): JSX.Element {
    const [projects, setProjects] = useState<Project[]>([]);
    const { user } = useAuthContext();
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);

    useEffect(() => {
        if (user) getProjects();
    }, [user]);

    async function getProjects() {
        fetch(`${config.API_URL}/projects/`, {
            headers: {
                'Authorization': `Bearer ${user?.token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const projects: Project[] = [];
            for(let p of data.projects) {
                projects.push({
                    _id: p._id,
                    name: p.name,
                    description: p.description,
                    tasks: p.tasks,
                    members: p.members,
                    owner: p.owner,
                    status: p.status
                });
            }
            setProjects(projects);
        })
        .catch(error => console.error(error));
    }

    return (
    <div className='ProjectsContainer'>
        <div className='ProjectsList'>
            <div className='NewProjectButton' onClick={()=>setShowNewProjectForm(true)}>
                <h3>Create New Project</h3>
            </div>
            {projects.map((p: Project) => (
            <div key={p._id}>
                <ProjectItem {...p} />
            </div>
            ))}
        </div>
        {showNewProjectForm && <NewProjectForm onExit={()=>setShowNewProjectForm(false)}/>}
    </div>
    )
}

