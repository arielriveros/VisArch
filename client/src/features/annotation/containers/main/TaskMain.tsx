import { useEffect } from 'react'
import { config } from '../../../../utils/config';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useTaskContext } from '../../hooks/useTask';
import TaskList from '../../../../containers/taskContainers/tasksGrid/TaskList';
import TaskSidebar from '../../components/sidebar/TaskSidebar';
import ArchetypesList from '../../components/archetypesList/ArchetypesList';
import AnnotationManager from '../annotation/manager/AnnotationManager';
import ProxyMeshContextProvider from '../../contexts/ProxyMeshContext';
import IndicesContextProvider from '../../contexts/IndicesContext';
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

	const uploadTask = async () => {
        try {
            if (!task) return;

            const response = await fetch(`${config.API_URL}/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...task})
            });

            if (!response.ok)
                throw new Error('Failed to upload task');

        } catch (error) {
            console.error(error);
        }
    }
			
	useEffect(() => {
		getTask();
	}, [props.taskId]);

	return (
		<div className='task-main'>
			<div className='task-sidebar-container'> 
				<TaskSidebar>
					<ArchetypesList />
					<button onClick={uploadTask}> Upload </button>
					<TaskList projectId={props.projectId} type={'task-list'} />
				</TaskSidebar>
			</div>
			<ProxyMeshContextProvider>
				<IndicesContextProvider>
					<div className='task-content'>
						<AnnotationManager />
					</div>
				</IndicesContextProvider>
			</ProxyMeshContextProvider>
		</div>
	)
}
