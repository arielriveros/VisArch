import { useState } from 'react';
import TextInput from 'common/components/input/TextInput'
import ProjectsList from 'features/projectManagement/containers/projectsList/ProjectsList'
import './Projects.css'

export default function Projects(): JSX.Element {
  const [search, setSearch] = useState<string>('');

  return (
    <div className='Projects'>
      <div className='TopBar'>
				<h2>Projects</h2>
				<div>
					<TextInput label='Search' targetName='search' type='text' handleInput={(e) => setSearch(e.target.value)} />
				</div>
        <div />
			</div>
      <ProjectsList filter={search}/>
    </div>
  )
}