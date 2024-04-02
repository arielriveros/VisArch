import { Link, useNavigate } from 'react-router-dom';
import { ProjectsApiResponse } from '@/api/types';
import Button from './buttons/Button';

function GridElement({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full'>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {children}
    </div>
  );
}

interface ProjectListProps {
  userId: string;
  projects: ProjectsApiResponse;
}
export default function ProjectList(props: ProjectListProps) {

  const { userId, projects } = props;
  const navigate = useNavigate();

  return (
    <div className='flex flex-col w-full'>
      <Grid>
        <GridElement>
          <Link to='/projects/new'>
            <span className='flex flex-col w-full h-full p-4 bg-dark-blue border border-light-blue rounded'>
              Create new project
            </span>
          </Link>
        </GridElement>
        {projects?.map((project) => (
          <GridElement key={project._id}>
            <span className='flex flex-col w-full h-full p-4 bg-dark-blue border border-light-blue rounded'>
              <p className='text-lg font-bold'>{project.name}</p>
              { project.description !== '' ? <p>{ project.description }</p> : null }
              <p>Tasks: { project.tasks.length } </p>
              <p>Description: { project.description !== '' ? project.description : <i>No Description</i> } </p>
              <p>Owner: {project.owner.displayName} { project.owner._id === userId ? '(You)' : `(${project.owner.email})` } </p>
              <p>Collaborators: { project.collaborators.length } </p>
              <section className='flex flex-row justify-evenly'>
                <Button onClick={() => navigate(`/projects/${project._id}/tasks`)}> Tasks </Button>
                <Button onClick={() => navigate(`/projects/${project._id}/details`)}> Details </Button>
                { project.owner._id === userId && <Button onClick={() => navigate(`/projects/${project._id}/edit`)}> Edit </Button> }
              </section>
            </span>
          </GridElement>
        ))}
      </Grid>
    </div>
  );
}