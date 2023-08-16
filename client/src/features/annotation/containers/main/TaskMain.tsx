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

	const uploadTask = async () => {
        try {
            if (!task) return;

            let curatedTask = {
                name: task.name,
                status: task.status,
            };

            const response = await fetch(`${config.API_URL}/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(curatedTask)
            });

            const data = await response.json();
            dispatch({ type: 'SET_TASK', payload: data }); // Update

            if (!response.ok)
                throw new Error('Failed to upload task');

        } catch (error) {
            console.error(error);
        }
    }
			
	useEffect(() => {
		getTask();
	}, []);

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
