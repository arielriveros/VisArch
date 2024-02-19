import { useEffect } from 'react'
import { Project, Task } from 'common/api/ModelTypes';
import { API_ENDPOINT } from 'common/api/Endpoints';
import { useAuthContext } from 'features/authentication/hooks/useAuthContext';
import { useTaskContext } from 'features/annotation/hooks/useTask';
import { useSocket } from 'features/socket/hooks/useSocket';
import { calculateBoundingBox } from 'features/annotation/utils/boundingBox';
import AnnotationManager from '../annotation/manager/AnnotationManager';
import ProxyMeshContextProvider from '../../contexts/ProxyMeshContext';
import './TaskMain.css';

type TaskMainProps = {
	taskId: string;
	project: Project;
}

export default function TaskMain(props: TaskMainProps) {
	const { user } = useAuthContext();
	const { dispatch } = useTaskContext();
	const { connect, disconnect, join, leave } = useSocket();

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
			 {
				// ramdomized hex color
				const compToHex = (c: number) => {
					var hex = c.toString(16);
					return hex.length == 1 ? "0" + hex : hex;
				};
				let hex = [Math.random() * 255, Math.random() * 255, Math.random() * 255].map(Math.round).map(compToHex).join('');
				annotation.color = '#' + hex;
			 }
			task.class = props.project.class;

			dispatch({ type: 'SET_TASK', payload: task });
			
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		connect();
		return () => disconnect();
	}, []);
			
	useEffect(() => {
		getTask().then(() => {
			dispatch({ type: 'SET_LOADING', payload: false });
			join(`${props.project._id}:${props.taskId}`);
		});
		return () => {
			dispatch({ type: 'SET_LOADING', payload: false });
			leave(`${props.project._id}:${props.taskId}`);
		}
	}, [props.project, props.taskId]);

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
