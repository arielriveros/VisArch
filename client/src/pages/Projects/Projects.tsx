import ProjectsList from '../../containers/projectContainers/projectsList/ProjectsList'

import './Projects.css'

export default function Projects(): JSX.Element {

  return (
    <div className='projects'>
        <h3>Projects</h3>
        <ProjectsList />
    </div>
  )
}