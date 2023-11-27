import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext';
import { Project } from '../../../api/ModelTypes';
import TaskList from '../../../containers/taskContainers/tasksGrid/TaskList';
import './ProjectDetails.css'

export default function ProjectDetails() {
	const location = useLocation();
	const navigate = useNavigate();
	const [project, setProject] = useState<Project | null>(null);
	const { user } = useAuthContext();

	useEffect(() => {
		setProject(location.state.project);
	}, []);

	function handleGoToProjectSettings() {
		if (!project) return;
		navigate(`/projects/${project._id}/settings`, {
			state: {
				project: project
			}
		});
	} 

	
	return (
		<div className='ProjectDetails'>
			<div className='TopBar'>
				<h2>{project?.name} | Tasks</h2>
				<div> Search Bar </div>
				<div>
					{ user?.username === project?.owner.username && <button onClick={handleGoToProjectSettings}> Settings </button>}
				</div>
			</div>
			{ project && <TaskList projectId={project._id} /> }
		</div>
	)
}
