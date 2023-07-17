import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Project } from './Projects'
import TaskList from '../../containers/tasksList/TaskList';


export default function ProjectDetails() {
	const location = useLocation();
	const [project, setProject] = useState<Project | null>(null);	

	useEffect(() => {
		setProject(location.state.project);
	}, []);

	return (
		<div className='project-details'>
			ProjectDetails
			<div> Name: { project?.name } </div>
			<div> Description: { project?.description } </div>
			<div> Owner: { project?.owner.username } </div>
			<div> Members: { project?.members.map((m) => <div key={m._id}>{m.username}</div>) } </div>
			{ project && <TaskList projectId={project._id} tasksIds={project.tasks} /> }
		</div>
	)
}
