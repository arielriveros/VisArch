import { useState, useEffect } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext';
import { config } from '../../../utils/config';
import { Project } from '../../../api/ModelTypes';
import ProjectItem from './ProjectItem';
import NewProjectForm from '../createProject/NewProjectForm';
import Grid, { GridItem } from '../../../components/grid/Grid';
import './ProjectsList.css'

interface ProjectsListProps {
    filter?: string;
}

export default function ProjectsList(props: ProjectsListProps): JSX.Element {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const { user } = useAuthContext();
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

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
            setFilteredProjects(projects);
        })
        .catch(error => console.error(error));
    }

    async function addProject() {
        setShowNewProjectForm(false);
        setSelectedProject(null);
        if (user) getProjects();
    }

    useEffect(() => {
        setFilteredProjects(projects);
        if (props.filter) {
            const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(props.filter!.toLowerCase()));
            setFilteredProjects(filteredProjects);
        }
    }, [props.filter]);

    return (
        <Grid>
            <GridItem onClick={()=>{setSelectedProject(null); setShowNewProjectForm(true)}}>
                <h3>Create New Project</h3>
            </GridItem>
            {filteredProjects.map((p: Project) => (
                <ProjectItem key={p._id} project={p} selected={selectedProject === p._id} onClick={() => setSelectedProject(p._id)}/>
            ))}
            {showNewProjectForm && <NewProjectForm onAddProject={()=>addProject()} onExit={()=>setShowNewProjectForm(false)}/>}
        </Grid>
    )
}

