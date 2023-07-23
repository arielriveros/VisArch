import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Project } from '../../api/ModelTypes';
import TaskList from '../../containers/taskContainers/tasksGrid/TaskList';
import NewTaskForm from '../../containers/taskContainers/createTask/NewTaskForm';


export default function ProjectDetails() {
	const location = useLocation();
	const [project, setProject] = useState<Project | null>(null);	
	const [tasks, setTasks] = useState<{ _id: string;}[]>([]);

	useEffect(() => {
		setProject(location.state.project);
	}, []);

	useEffect(() => {
		if (project)
			setTasks(project.tasks);
	}, [project]);

	const onNewTask = (task: {_id: string}) => {
		setTasks([...tasks, task]);
	}

	return (
		<div className='project-details'>
			{ project && <TaskList type='task-grid' projectId={project._id} tasksIds={tasks} /> }
			{ project && <NewTaskForm projectId={project._id} handleNewTask={onNewTask}/> }
		</div>
	)
}
