import React from 'react'
import { Task } from '../../../api/ModelTypes'
import './TaskItem.css'

interface TaskItemProps extends Task {
    onTaskClick: (id: string) => void;
}

export default function TaskItem(props: TaskItemProps) {
    const handleClick = () => {
        props.onTaskClick(props._id);
    }

    return (
        <div className='task-item' onClick={handleClick}>
            <h4> {props.name} </h4>
            {/* Set later in development with api retrieved values */}
            <p> Archetypes: 0 </p>
            <p> Annotations: 0 </p>
        </div>
    )
}
