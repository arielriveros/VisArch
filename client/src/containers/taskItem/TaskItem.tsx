import React from 'react'
import { Task } from '../tasksList/TaskList'

interface TaskItemProps extends Task {}

export default function TaskItem(props: TaskItemProps) {
    return (
        <div className='task-item'>
            <div> Name: {props.name} </div>
            <div> Mesh Path: {props.meshPath} </div>
            <div> Status: {props.status} </div>
        </div>
    )
}
