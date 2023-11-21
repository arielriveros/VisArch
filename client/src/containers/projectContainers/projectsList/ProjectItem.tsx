import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { config } from '../../../utils/config';
import { Project } from '../../../api/ModelTypes';
import './ProjectsList.css'

interface ProjectItemProps extends Project {}

export default function ProjectItem(props: ProjectItemProps): JSX.Element {
  	const { user } = useAuthContext();
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);

	/* async function deleteProject(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
	} */

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

	function handleGoToProjectSettings() {
		navigate(`/projects/${props._id}/settings`, {
			state: {
				project: props
			}
		});
	}

	return (
	<div className='ProjectItem' onClick={handleProjectClick}>
		<div className="ProjectName"> {props.name} </div>
		<div> Status: {props.status} </div>
		<div className='Ownership'>
			<div className="Owner"> Owner: {props.owner.username === user?.username ? 'You' : props.owner.username} </div>
			<div className="Members"> Members: {props.members.length} </div>
		</div>
		{showMenu && (
		<div className="project-menu">
			<button onClick={handleGoToProject}>Go to Project</button>
			{user?.username === props.owner.username && (
				<button onClick={handleGoToProjectSettings}>Configure</button>
			)}
		</div>
		)}
	</div>
	);
}