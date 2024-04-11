import { useTranslation } from 'react-i18next';
import { TasksApiResponse } from '@/api/types';
import TaskTableRow from './TaskTableRow';

interface TaskTableProps {
  tasks: TasksApiResponse
}

export default function TaskTable(props: TaskTableProps) {
  const { tasks } = props;
  const { t } = useTranslation();

  return (
    <table className='border border-white w-full'>
      <colgroup>
        <col style={{ width: '20%' }} />
        <col style={{ width: '30%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '5%' }} />
        <col style={{ width: '10%' }} />
      </colgroup>
      <thead>
        <tr>
          <th>{t('tasks.name')}</th>
          <th>{t('tasks.description')}</th>
          <th>{t('annotation.archetypes')}</th>
          <th>{t('annotation.entities')}</th>
          <th>{t('tasks.mesh')}</th>
          <th>{t('tasks.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {tasks?.map((task) => (
          <TaskTableRow key={task._id} task={task} />
        ))}
      </tbody>
    </table>
  );
}
