import { API_BASE_URL } from '@/api/config';
import { TaskApiResponse } from '@/api/types';
import { useNavigate } from 'react-router-dom';
import ConfirmButton from '../ConfirmButton';

interface TaskTableRowProps {
  task: TaskApiResponse;
 }
 
export default function TaskTableRow(props: TaskTableRowProps) {
  const { task } = props;
  const navigate = useNavigate();

  const handleGoToTask = () => {
    navigate(`/task/${task._id}`);
  };

  const handleDeleteTask = () => {
    fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          navigate(0);
        } else {
          throw new Error('Failed to delete task');
        }
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  };
 
  return (
    <tr className='border border-white'>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {task.name}
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {task.description && task.description !=='' ? task.description : <i>No description</i> }
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {task.annotations.length}
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {task.annotations.reduce((acc, curr) => acc + curr.entities.length, 0)}
      </td>
      <td className='text-white border-r border-white items-center justify-center'>
        <img src={`${API_BASE_URL}/api/files/images/${task.thumbnail}`} alt='thumbnail' />
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        <button className='bg-blue rounded-md p-1 mt-3 m-2' onClick={handleGoToTask}>Annotate</button>
        <ConfirmButton label='Delete' onConfirm={() => handleDeleteTask()} />
      </td>
    </tr>
  );
}