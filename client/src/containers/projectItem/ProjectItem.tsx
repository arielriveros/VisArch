import React from 'react'
import { Project } from '../projectsList/ProjectsList'
import { useAuthContext } from '../../hooks/useAuthContext'
import { config } from '../../utils/config'
import "./ProjectItem.css"

export default function ProjectItem(props: Project): JSX.Element {

  const { user } = useAuthContext();

  async function deleteProject() {
    fetch(`${config.API_URL}/projects/${props._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user?.token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    });
  }

  return (
      <div className='project-item'>
          <div> Name: {props.name} </div>
          <div> Description: {props.description} </div>
          <div> Owner: {props.owner.username} </div>
          <div> Members: {props.members.length} </div>
          <div> Status: {props.status} </div>
          { user?.username === props.owner.username && <button onClick={deleteProject} className='project-delete-btn'> Delete </button> }
      </div>
  )
}
