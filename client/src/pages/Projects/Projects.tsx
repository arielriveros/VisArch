import React, { useState } from 'react'
import ProjectsList from '../../containers/projectsList/ProjectsList'
import NewProjectForm from '../../containers/createProject/NewProjectForm'
import './Projects.css'

export type Project = {
  _id: number;
  name: string;
  description?: string;
  members: {
      _id: string;
      username: string;
  }[];
  owner: {
      _id: string;
      username: string;
  };
  status: 'active' | 'archived';
}

enum ProjectsMenu {
  MY_PROJECTS,
  CREATE_PROJECT
}

export default function Projects(): JSX.Element {
  const [menuSelection, setMenuSelection] = useState(ProjectsMenu.MY_PROJECTS)

  return (
    <div className='projects'>
        <h3>Projects</h3>
        <div className='projects-submenu'>
          <button 
            disabled={menuSelection===ProjectsMenu.MY_PROJECTS}
            onClick={()=>setMenuSelection(ProjectsMenu.MY_PROJECTS)}
            className='projects-btn'>
              My Projects
            </button>
          <button 
            disabled={menuSelection===ProjectsMenu.CREATE_PROJECT}
            onClick={()=>setMenuSelection(ProjectsMenu.CREATE_PROJECT)}
            className='projects-btn'>
              Create Project
          </button>
        </div>
        {menuSelection===ProjectsMenu.MY_PROJECTS && <ProjectsList />}
        {menuSelection===ProjectsMenu.CREATE_PROJECT && <NewProjectForm />}
        
    </div>
  )
}