import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ProjectApiResponse } from '@/api/types';
import Button from '@/components/buttons/Button';

interface ProjectTableRowProps {
  userId: string;
  project: ProjectApiResponse;
}
 
export default function ProjectTableRow(props: ProjectTableRowProps) {
  const { userId, project } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
 
  return (
    <tr className='border border-white'>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {project.name}
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {project.description && project.description !=='' ? project.description : <i>{t('projects.no-description')}</i> }
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {project.tasks.length}
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {project.owner.displayName} { project.owner._id === userId ? `(${t('projects.owner-you')})` : `(${project.owner.email})` }
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {project.collaborators.length}
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white items-center justify-center'>
        <section className='flex flex-row justify-evenly'>
          <Button onClick={() => navigate(`/projects/${project._id}/tasks`)}> {t('projects.tasks')} </Button>
          <Button onClick={() => navigate(`/projects/${project._id}/details`)}> {t('projects.details')} </Button>
          {project.owner._id === userId && <Button onClick={() => navigate(`/projects/${project._id}/edit`)}> {t('projects.edit')} </Button>}
        </section>
      </td>
    </tr>
  );
}