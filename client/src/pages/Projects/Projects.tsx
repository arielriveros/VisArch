import React from 'react'
import MeshList from '../../containers/meshList/MeshList'
import ProjectsList from '../../containers/projectsList/ProjectsList'

export default function Projects(): JSX.Element {
  return (
    <div>
        <h3>Projects</h3>
        <ProjectsList />
    </div>
  )
}