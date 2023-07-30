import { useEffect } from 'react'
import { config } from '../../../../utils/config';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useTaskContext } from '../../hooks/useTask';
import TaskList from '../../../../containers/taskContainers/tasksGrid/TaskList';
import './TaskMain.css';
import TaskSidebar from '../../components/sidebar/TaskSidebar';
import AnnotationManager from '../annotation/manager/AnnotationManager';
import ProxyMeshContextProvider from '../../contexts/ProxyMeshContext';

type TaskMainProps = {
	taskId: string;
	projectId: string;
}

export default function TaskMain(props: TaskMainProps) {
	const { user } = useAuthContext();
	const { dispatch } = useTaskContext();

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
