import { useLocation } from 'react-router-dom';
import { Project } from '../../api/ModelTypes';
import EditProjectForm from '../../containers/projectContainers/editProject/EditProjectForm';
import './ProjectSettings.css';

export default function ProjectSettings() {
    const project: Project = useLocation().state.project;

    return (
        <div className='ProjectSettings'>
            <EditProjectForm project={project} />
        </div>
    )
}
