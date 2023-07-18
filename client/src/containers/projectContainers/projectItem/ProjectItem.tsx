import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { config } from '../../../utils/config';
import { Project } from '../../../api/ModelTypes';
import './ProjectItem.css';

interface ProjectItemProps extends Project {}

export default function ProjectItem(props: ProjectItemProps): JSX.Element {
  	const { user } = useAuthContext();
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);

	async function deleteProject(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		fetch(`${config.API_URL}/projects/${props._id}`, {
			method: 'DELETE',
			headers: {
			'Authorization': `Bearer ${user?.token}`
			}
		})
		.then(response => response.json())
		.then(data => {
			console.log(data);
		});
	}

	function handleProjectClick() {
		setShowMenu((prevShowMenu) => !prevShowMenu);
	}

	function handleGoToProject() {
		// Navigate to the project details page and pass the project data as state
		navigate(`/projects/${props._id}`, {
			state: {
				project: props
			}
		});
	}

	return (
	<div className='project-item' onClick={handleProjectClick}>
		<div> Name: {props.name} </div>
		<div> Description: {props.description} </div>
		<div> Owner: {props.owner.username} </div>
		<div> Members: {props.members.length} </div>
		<div> Status: {props.status} </div>
		{showMenu && (
		<div className="project-menu">
			<button onClick={handleGoToProject}>Go to Project</button>
			{user?.username === props.owner.username && (
				<button onClick={deleteProject}>Delete</button>
			)}
		</div>
		)}
	</div>
	);
}