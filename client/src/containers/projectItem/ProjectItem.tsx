import React from 'react'
import { Project } from '../projectsList/ProjectsList'
import "./ProjectItem.css"

export default function ProjectItem(props: Project): JSX.Element {
  return (
    <>
        <div className='project-item'>
            <div> Name: {props.name} </div>
            <div> Description: {props.description} </div>
            <div> Owner: {props.owner} </div>
            <div> Members: {props.members} </div>
            <div> Status: {props.status} </div>
        </div>
        
    </>

  )
}
