import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/api/config';
import { TaskApiResponse } from '@/api/types';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import Button from '@/components/buttons/Button';
import ProgressBar from '../ProgressBar';

interface TaskTableRowProps {
  task: TaskApiResponse;
 }
 
export default function TaskTableRow(props: TaskTableRowProps) {
  const { task } = props;
  const [downloading, setDownloading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
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

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`${API_BASE_URL}/api/files/tasks/${task._id}`, {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok)
        throw new Error('Failed to download task');

      // Get the total size of the file from the response headers
      const totalSize = Number(response.headers.get('Content-Length'));
      setTotal(totalSize);
      let loadedSize = 0;
      setCurrent(loadedSize);
  
      // Accumulate response data in chunks
      if (!response.body) {
        throw new Error('Response body is null');
      }
      const chunks: Uint8Array[] = [];
      const reader = response.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        loadedSize += value.length;
        setCurrent(loadedSize);
      }

      // Once the entire response is read, create a blob from accumulated chunks
      const blob = new Blob(chunks);
  
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${task.name}.zip`;
      a.click();
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setDownloading(false);
      setCurrent(0);
    }
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
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white items-center justify-center'>
        <Button onClick={handleGoToTask}>Annotate</Button>
        <ConfirmButton label='Delete' onConfirm={() => handleDeleteTask()} />
        {
          downloading ?
            <ProgressBar current={current === 0 ? null : current} total={total} />
            :
            <Button onClick={handleDownload}>Download</Button>
        }
      </td>
    </tr>
  );
}