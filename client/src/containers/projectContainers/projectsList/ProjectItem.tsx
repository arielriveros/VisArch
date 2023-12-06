import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { Project } from '../../../api/ModelTypes';
import { GridItem } from '../../../components/grid/Grid';
import './ProjectsList.css'

interface ProjectItemProps {
	project: Project;
	selected: boolean;
	onClick?: () => void;
}

export default function ProjectItem(props: ProjectItemProps): JSX.Element {
  	const { user } = useAuthContext();
	const navigate = useNavigate();

	function handleGoToProject() {
		// Navigate to the project details page and pass the project data as state
		navigate(`/projects/${props.project._id}`, {
			state: {
				project: props.project
			}
		});
	}

	return (
	<GridItem onClick={handleGoToProject}>
		<div className="ProjectTitle"> 
			<div className="ProjectName">{props.project.name}</div> 
			<p>({props.project.status})</p>
		</div>
		<div className='ProjectClass'> {props.project.class[0].toUpperCase() + props.project.class.slice(1)} </div>
		<div className='ProjectDescription'> {props.project.description} </div>
		<div className='ProjectTasks'> <b>Tasks: </b> {props.project.tasks.length} </div>
		<div className='Ownership'>
			<div className="Owner"> <b>Owner: </b> {props.project.owner.username === user?.username ? 'You' : props.project.owner.username} </div>
			<div className="Members"> <b>Members: </b> {props.project.members.length} </div>
		</div>
	</GridItem>
	);
}