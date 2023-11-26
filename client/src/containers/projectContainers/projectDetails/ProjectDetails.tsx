import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Project } from '../../../api/ModelTypes';
import TaskList from '../../../containers/taskContainers/tasksGrid/TaskList';
import './ProjectDetails.css'

export default function ProjectDetails() {
	const location = useLocation();
	const [project, setProject] = useState<Project | null>(null);

	useEffect(() => {
		setProject(location.state.project);
	}, []);

	
	return (
		<div className='project-details'>
			<h3>Tasks</h3>
			{ project && <TaskList projectId={project._id} /> }
		</div>
	)
}
