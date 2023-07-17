import React, { useState, useEffect } from 'react'
import { config } from '../../utils/config';
import { useAuthContext } from '../../hooks/useAuthContext';
import TaskItem from '../taskItem/TaskItem';

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
        props.tasksIds?.forEach( (t: {_id: string}) => {
			getTasks(t._id);
		});
    }, []);

    async function getTasks(taskId: string) {
		try {
			const response = await fetch(`${config.API_URL}/tasks/${taskId}`, {
				headers: {
					'Authorization': `Bearer ${user?.token}`
				}
			});
			const data = await response.json();
			setTasks([...tasks, data]);
		} catch (error) {
			console.error(error);
		}
	}
    return (
        <div>TaskList
            {tasks.map((t: Task) => <TaskItem key={t._id} {...t} />)}
        </div>
    )
}
