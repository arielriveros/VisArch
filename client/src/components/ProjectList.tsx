import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className='flex flex-col w-full'>
      <Grid>
        <GridElement>
          <Link to='/projects/new'>
            <span className='flex flex-col w-full h-full p-4 bg-dark-blue border border-light-blue rounded'>
              {t('projects.form.new-project')}
            </span>
          </Link>
        </GridElement>
        {projects?.map((project) => (
          <GridElement key={project._id}>
            <span className='flex flex-col w-full h-full p-4 bg-dark-blue border border-light-blue rounded'>
              <p className='text-lg font-bold'>{project.name}</p>
              { project.description !== '' ? <p>{ project.description }</p> : null }
              <p>{t('projects.tasks')}: { project.tasks.length } </p>
              <p>{t('projects.description')}: { project.description !== '' ? project.description : <i>{t('projects.no-description')}</i> } </p>
              <p>{t('projects.owner')}: {project.owner.displayName} { project.owner._id === userId ? `(${t('projects.owner-you')})` : `(${project.owner.email})` } </p>
              <p>{t('projects.collaborators')}: { project.collaborators.length } </p>
              <section className='flex flex-row justify-evenly'>
                <Button onClick={() => navigate(`/projects/${project._id}/tasks`)}> {t('projects.tasks')} </Button>
                <Button onClick={() => navigate(`/projects/${project._id}/details`)}> {t('projects.details')} </Button>
                { project.owner._id === userId && <Button onClick={() => navigate(`/projects/${project._id}/edit`)}> {t('projects.edit')} </Button> }
              </section>
            </span>
          </GridElement>
        ))}
      </Grid>
    </div>
  );
}