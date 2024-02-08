import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from 'features/authentication/hooks/useAuthContext';
import { Project } from 'common/api/ModelTypes';
import TextInput from 'common/components/input/TextInput';
import TaskList from 'features/projectManagement/containers/tasksGrid/TaskList';
import './ProjectDetails.css'

export default function ProjectDetails() {
	const location = useLocation();
	const navigate = useNavigate();
	const [project, setProject] = useState<Project | null>(null);
	const [search, setSearch] = useState<string>('');
	const { user } = useAuthContext();

	useEffect(() => {
		setProject(location.state.project);
	}, [location.state.project]);

	function handleGoToProjectSettings() {
		if (!project) return;
		navigate(`/projects/${project._id}/settings`, {
			state: { project }
		});
	} 
	
	return (
		<div className='ProjectDetails'>
		{ project && <>
			<div className='TopBar'>
				<h2> {project?.name} | Tasks</h2>
				<div>
					<TextInput label='Search' targetName='search' type='text' handleInput={(e) => setSearch(e.target.value)} />
				</div>
				<div>
					{ user?.username === project?.owner.username && <button onClick={handleGoToProjectSettings}> Settings </button>}
				</div>
			</div>
			<TaskList project={project} filter={search}/>
		</>	}
		</div>
	)
}
