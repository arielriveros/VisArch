import React, { useState, useEffect } from 'react'
import { config } from '../../../utils/config';
import { useAuthContext } from '../../../hooks/useAuthContext';
import TaskItem from '../taskItem/TaskItem';
import NewTaskForm from '../createTask/NewTaskForm';

export type Task = {
	_id: string,
	name: string,
	meshPath: string,
	status: 'active' | 'archived',
}

type TaskListProps = {
    projectId: string;
    tasksIds: {_id: string}[];
}

export default function TaskList(props: TaskListProps) {
    const { user } = useAuthContext();
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect (() => {
		getTasks()}, 
	[]);

    async function getTasks() {
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
	}
    return (
        <div>TaskList
            {tasks.map((t: Task) => <TaskItem key={t._id} {...t} />)}
			<NewTaskForm projectId={props.projectId}/>
        </div>
    )
}
