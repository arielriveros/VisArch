import { useState, useEffect } from 'react';
import { config } from '../../../utils/config';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { Task } from '../../../api/ModelTypes';
import TaskItem from '../taskItem/TaskItem';
import './TaskList.css';

type TaskListProps = {
  projectId: string;
  tasksIds: { _id: string }[];
};

export default function TaskList(props: TaskListProps) {
	const { user } = useAuthContext();
	const [tasks, setTasks] = useState<Task[]>([]);

	const getTasks = async () => {
		try {
		const response = await fetch(`${config.API_URL}/projects/${props.projectId}/tasks/`, {
				headers: {
					'Authorization': `Bearer ${user?.token}`
				}
		});
		const data = await response.json();
		setTasks(data.tasks);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getTasks();
  	}, [props.tasksIds]);

	return (
		<div className='task-list'>
		<div className='task-grid'>
			{tasks.map((t: Task) => (
				<div key={t._id} className='task-grid-item'>
					<TaskItem {...t} />
				</div>
			))}
		</div>
		</div>
	);
}
