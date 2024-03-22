import { TasksApiResponse } from '@/api/types';
import TaskTableRow from './TaskTableRow';

interface TaskTableProps {
  tasks: TasksApiResponse
}

export default function TaskTable(props: TaskTableProps) {
  const { tasks } = props;

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
          <th>Name</th>
          <th>Description</th>
          <th>Archetypes</th>
          <th>Entities</th>
          <th>Model</th>
          <th>Actions</th>
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
