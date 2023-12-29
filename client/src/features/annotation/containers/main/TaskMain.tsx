import { useEffect } from 'react'
import { Project, Task } from 'common/api/ModelTypes';
import { API_ENDPOINT } from 'common/api/Endpoints';
import { useAuthContext } from 'features/authentication/hooks/useAuthContext';
import { useTaskContext } from 'features/annotation/hooks/useTask';
import { useSocket } from 'features/socket/hooks/useSocket';
import AnnotationManager from '../annotation/manager/AnnotationManager';
import ProxyMeshContextProvider from '../../contexts/ProxyMeshContext';
import './TaskMain.css';

type TaskMainProps = {
	taskId: string;
	project: Project;
}

export default function TaskMain(props: TaskMainProps) {
	const { user } = useAuthContext();
	const { dispatch, loading } = useTaskContext();
	const { join, leave, roomId } = useSocket();

	const getTask = async () => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true });
			const response = await fetch(`${API_ENDPOINT()}/tasks/${props.taskId}`, {
				headers: {
					'Authorization': `Bearer ${user?.token}`
				}
			});

			const task: Task = await response.json();
			for (let annotation of task.annotations)
				annotation.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16); // TODO: Fix some colors not working

			task.class = props.project.class;

			dispatch({ type: 'SET_TASK', payload: task });
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
			<ProxyMeshContextProvider>
				<div className='task-content'>
					<AnnotationManager />
				</div>
			</ProxyMeshContextProvider>
		</div>
	)
}
