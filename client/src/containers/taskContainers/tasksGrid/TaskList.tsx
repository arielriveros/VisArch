import { useState, useEffect } from 'react';
import { config } from '../../../utils/config';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { Task } from '../../../api/ModelTypes';
import TaskItem from './TaskItem';
import NewTaskForm from '../createTask/NewTaskForm';
import Grid, { GridItem } from '../../../components/grid/Grid';
import './TaskList.css';

type TaskListProps = {
  projectId: string;
  filter?: string
};

export default function TaskList(props: TaskListProps) {
	const { user } = useAuthContext();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [showNewTaskForm, setShowNewTaskForm] = useState(false);

	const getTasks = async () => {
		try {
		const response = await fetch(`${config.API_URL}/projects/${props.projectId}/tasks/`, {
				headers: {
					'Authorization': `Bearer ${user?.token}`
				}
		});
		const data = await response.json();
		setTasks(data.tasks);
		setFilteredTasks(data.tasks);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getTasks();
	}, [props.projectId]);

	useEffect(() => {
		setFilteredTasks(tasks);
		if (props.filter) {
			const filteredTasks = tasks.filter(t => t.name.toLowerCase().includes(props.filter!.toLowerCase()));
			setFilteredTasks(filteredTasks);
		}
	}, [props.filter]);

	// TODO: Show currently connected users to the task
	return (
		<Grid>
			<GridItem onClick={()=>setShowNewTaskForm(true)}>
				<h4>Add New Task</h4>
			</GridItem>
			{filteredTasks.map((t: Task) => (
				<TaskItem key={t._id} {...t} projectId={props.projectId} />
			))}
			{ showNewTaskForm && 
				<NewTaskForm 
					projectId={props.projectId} 
					handleNewTask={() => { setShowNewTaskForm(false); getTasks(); } }
				/>
			}
		</Grid>
	);
}
