import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Project } from '../../api/ModelTypes';
import TaskList from '../../containers/taskContainers/tasksList/TaskList';
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
			ProjectDetails
			<div> Name: { project?.name } </div>
			<div> Description: { project?.description } </div>
			<div> Owner: { project?.owner.username } </div>
			<div> Members: { project?.members.map((m) => <div key={m._id}>{m.username}</div>) } </div>
			{ project && <TaskList projectId={project._id} tasksIds={tasks} /> }
			{ project && <NewTaskForm projectId={project._id} handleNewTask={onNewTask}/> }
		</div>
	)
}
