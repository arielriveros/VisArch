import { useEffect } from 'react'
import { config } from '../../../../utils/config';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useTaskContext } from '../../hooks/useTask';
import { useSocket } from '../../../socket/hooks/useSocket';
import { Project } from '../../../../api/ModelTypes';
import TaskSidebar from '../../components/sidebar/TaskSidebar';
import ArchetypesList from '../../components/archetypesList/ArchetypesList';
import AnnotationManager from '../annotation/manager/AnnotationManager';
import ProxyMeshContextProvider from '../../contexts/ProxyMeshContext';
import './TaskMain.css';

type TaskMainProps = {
	taskId: string;
	project: Project;
}

export default function TaskMain(props: TaskMainProps) {
	const { user } = useAuthContext();
	const { task, dispatch, uploadTask, loading } = useTaskContext();
	const { join, leave, roomId } = useSocket();

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
				annotation.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16); // TODO: Fix some colors not working

			dispatch({ type: 'SET_TASK', payload: task });
			dispatch({ type: 'SET_CLASS', payload: props.project.class });
			dispatch({ type: 'SET_LOADING', payload: false });
		} catch (error) {
			console.error(error);
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	};

	
			
	useEffect(() => {
		getTask();
	}, [props.taskId]);

	useEffect(() => {
		if (!props.project) return;
		if (loading) return;
		if (roomId) leave(); // Leave previous room
		const newRoomId = `${props.project._id}:${props.taskId}`
		join(newRoomId);

		return () => { if (roomId) leave(); }
	}
	, [props.project, props.taskId, loading]);


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
