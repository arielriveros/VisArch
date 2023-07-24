import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Task } from '../../../api/ModelTypes'
import { useTaskContext } from '../../../features/annotation/hooks/useTask';
import './TaskItem.css'

interface TaskItemProps extends Task {
    projectId: string;
    minimal?: boolean;
}

export default function TaskItem(props: TaskItemProps) {
    const navigate = useNavigate();
    const { task, dispatch } = useTaskContext();

    const handleGoToTask = () => {
		// Navigate to the task annotation tool page and pass task id as state
		navigate(`/task/${props._id}`, {
			state: {
				taskId: props._id,
                projectId: props.projectId
			}
		});
        dispatch({ type: 'SET_TASK', payload: props });
	}

    return (
        <div className='task-item' onClick={handleGoToTask}>
            {
                props.minimal ? 
                <p> {props.name} </p>
                : 
                <>
                    <h4> {props.name} </h4>
                    <p> Archetypes: 0 </p>
                    <p> Annotations: 0 </p>
                </>
            }
            
        </div>
    )
}
