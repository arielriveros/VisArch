import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Task } from '../../../api/ModelTypes'
import './TaskItem.css'

interface TaskItemProps extends Task {
    minimal?: boolean;
}

export default function TaskItem(props: TaskItemProps) {
    const navigate = useNavigate();

    function handleGoToTask() {
		// Navigate to the task annotation tool page and pass task id as state
		navigate(`/task/${props._id}`, {
			state: {
				taskId: props._id
			}
		});
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
