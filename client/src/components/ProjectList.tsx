import { Link } from 'react-router-dom';
import { ProjectsApiResponse } from '@/api/types';

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
            <Link to={`/projects/${project._id}`} key={project._id}>
              <span className='flex flex-col w-full h-full p-4 bg-dark-blue border border-light-blue rounded'>
                <p className='text-lg font-bold'>{project.name}</p>
                { project.description !== '' ? <p>{ project.description }</p> : null }
                <p>Tasks: { project.tasks.length } </p>
                <p>Owner: {project.owner.name} { project.owner._id === userId ? '(You)' : project.owner.email } </p>
                <p>Collaborators: { project.collaborators.length } </p>
              </span>
            </Link>
          </GridElement>
        ))}
      </Grid>
    </div>
  );
}