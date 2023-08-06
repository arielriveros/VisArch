import { useEffect } from 'react'
import { config } from '../../../../utils/config';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useTaskContext } from '../../hooks/useTask';
import TaskList from '../../../../containers/taskContainers/tasksGrid/TaskList';
import TaskSidebar from '../../components/sidebar/TaskSidebar';
import AnnotationManager from '../annotation/manager/AnnotationManager';
import ProxyMeshContextProvider from '../../contexts/ProxyMeshContext';
import ArchetypesList from '../archetypesList/ArchetypesList';
import './TaskMain.css';

type TaskMainProps = {
	taskId: string;
	projectId: string;
}

export default function TaskMain(props: TaskMainProps) {
	const { user } = useAuthContext();
	const { task, dispatch } = useTaskContext();

	const getTask = async () => {
		try {
			const response = await fetch(`${config.API_URL}/tasks/${props.taskId}`, {
				headers: {
					'Authorization': `Bearer ${user?.token}`
				}
			});
			const task = await response.json();
			dispatch({ type: 'SET_TASK', payload: task });
		} catch (error) {
			console.error(error);
		}
	};
			
	useEffect(() => {
		getTask();
	}, []);

	return (
		<div className='task-main'>
			<div className='task-sidebar-container'> 
				<TaskSidebar>
					<ArchetypesList />
					<TaskList projectId={props.projectId} type={'task-list'} />
				</TaskSidebar>
			</div>
			<ProxyMeshContextProvider>
				<div className='task-content'>
					<AnnotationManager />
				</div>
			</ProxyMeshContextProvider>
		</div>
	)
}
