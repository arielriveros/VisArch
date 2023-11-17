import { useEffect } from 'react'
import { config } from '../../../../utils/config';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useTaskContext } from '../../hooks/useTask';
import { useSocket } from '../../../socket/hooks/useSocket';
import TaskList from '../../../../containers/taskContainers/tasksGrid/TaskList';
import TaskSidebar from '../../components/sidebar/TaskSidebar';
import ArchetypesList from '../../components/archetypesList/ArchetypesList';
import AnnotationManager from '../annotation/manager/AnnotationManager';
import ProxyMeshContextProvider from '../../contexts/ProxyMeshContext';
import './TaskMain.css';

type TaskMainProps = {
	taskId: string;
	projectId: string;
}

export default function TaskMain(props: TaskMainProps) {
	const { user } = useAuthContext();
	const { task, dispatch, uploadTask } = useTaskContext();
	const { join, leave } = useSocket();

	const getTask = async () => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true });
			const response = await fetch(`${config.API_URL}/tasks/${props.taskId}`, {
				headers: {
					'Authorization': `Bearer ${user?.token}`
				}
			});
			const task = await response.json();
			for (let annotation of task.annotations)
				annotation.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

			dispatch({ type: 'SET_TASK', payload: task });
			dispatch({ type: 'SET_LOADING', payload: false });
		} catch (error) {
			console.error(error);
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	};

	
			
	useEffect(() => {
		getTask();
		const room = `${props.projectId}:${props.taskId}`
		leave(); // Leave previous room
		join(room);

		return () => {
			leave();
		}
	}, [props.taskId]);

	return (
		<div className='task-main'>
			<div className='task-sidebar-container'> 
				<TaskSidebar>
					<ArchetypesList />
					<button onClick={()=>{
						if (task && user)
							uploadTask(task, user.token, (response: any) => {
								console.log(response);
							});
					}}> Upload </button>
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
