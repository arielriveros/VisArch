import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { config } from '../../../utils/config';
import { Project } from '../../../api/ModelTypes';
import './ProjectsList.css'
import { GridItem } from '../../../components/grid/Grid';

interface ProjectItemProps {
	project: Project;
	selected: boolean;
	onClick?: () => void;
}

export default function ProjectItem(props: ProjectItemProps): JSX.Element {
  	const { user } = useAuthContext();
	const navigate = useNavigate();

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

	function handleGoToProject() {
		// Navigate to the project details page and pass the project data as state
		navigate(`/projects/${props.project._id}`, {
			state: {
				project: props.project
			}
		});
	}

	function handleGoToProjectSettings() {
		navigate(`/projects/${props.project._id}/settings`, {
			state: {
				project: props.project
			}
		});
	}

	return (
	<GridItem onClick={props.onClick}>
		<div className="ProjectTitle"> 
			<div className="ProjectName">{props.project.name}</div> 
			<p>({props.project.status})</p>
		</div>
		<div className='ProjectDescription'> {props.project.description} </div>
		<div className='ProjectTasks'> Tasks: {props.project.tasks.length} </div>
		<div className='Ownership'>
			<div className="Owner"> Owner: {props.project.owner.username === user?.username ? 'You' : props.project.owner.username} </div>
			<div className="Members"> Members: {props.project.members.length} </div>
		</div>
		<div className={`ProjectMenu ${props.selected ? 'Selected' : ''}`}>
			<button onClick={handleGoToProject}>Go to Project</button>
			{user?.username === props.project.owner.username && (
				<button onClick={handleGoToProjectSettings}>Configure</button>
			)}
		</div>
	</GridItem>
	);
}