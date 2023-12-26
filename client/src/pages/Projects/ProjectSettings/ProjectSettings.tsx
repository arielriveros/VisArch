import { useLocation } from 'react-router-dom';
import { Project } from 'common/api/ModelTypes';
import EditProjectForm from 'features/projectManagement/containers/editProject/EditProjectForm';
import './ProjectSettings.css';

export default function ProjectSettings() {
    const project: Project = useLocation().state.project;

    return (
        <div className='ProjectSettings'>
            <EditProjectForm project={project} />
        </div>
    )
}
