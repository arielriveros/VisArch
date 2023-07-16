import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import { config } from '../../utils/config';
import ProjectItem from '../projectItem/ProjectItem';
import './ProjectsList.css'

export type Project = {
    _id: number;
    name: string;
    description?: string;
    members: {
        _id: string;
        username: string;
    }[];
    owner: {
        _id: string;
        username: string;
    };
    status: 'active' | 'archived';
}

export default function ProjectsList(): JSX.Element {
    const [projects, setProjects] = useState<Project[]>([]);
    const { user } = useAuthContext();

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
            console.log(data);
            const projects: Project[] = [];
            for(let p of data.projects) {
                projects.push({
                    _id: p._id,
                    name: p.name,
                    description: p.description,
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
        <div className='projects-list'>
            {projects.map((p: Project) => <ProjectItem key={p._id} {...p} />)}
        </div>
    )
}

