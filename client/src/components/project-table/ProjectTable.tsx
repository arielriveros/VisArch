import { useTranslation } from 'react-i18next';
import { ProjectsApiResponse } from '@/api/types';
import ProjectTableRow from './ProjectTableRow';

interface ProjectTableProps {
  userId: string;
  projects: ProjectsApiResponse;
}

export default function ProjectTable(props: ProjectTableProps) {
  const { projects, userId } = props;
  const { t } = useTranslation();

  return (
    <table className='border border-white w-4/5'>
      <colgroup>
        <col style={{ width: '10%' }} />
        <col style={{ width: '30%' }} />
        <col style={{ width: '5%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '5%' }} />
        <col style={{ width: '5%' }} />
      </colgroup>
      <thead>
        <tr>
          <th>{t('projects.name')}</th>
          <th>{t('projects.description')}</th>
          <th>{t('projects.tasks')}</th>
          <th>{t('projects.owner')}</th>
          <th>{t('projects.collaborators')}</th>
          <th>{t('tasks.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {projects?.map((project) => (
          <ProjectTableRow key={project._id} project={project} userId={userId}/>
        ))}
      </tbody>
    </table>
  );
}
