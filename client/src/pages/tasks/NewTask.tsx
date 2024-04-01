import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '@/api/config';
import useSession from '@/hooks/useSession';
import TaskForm from '@/components/forms/TaskForm';

export default function NewTask() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  const [task, setTask] = useState<{
    name: string;
    description:
    string,
    mesh: File | null; 
    thumbnail: File | null;
  }>({name: '', description: '', mesh: null, thumbnail: null});
  const [loading, setLoading] = useState(false);
  const [stateText, setStateText] = useState('');

  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
  
    try {
      if (!task.mesh || !task.thumbnail) return;
      setLoading(true);
      setStateText('Setting up data');
      const formData = new FormData();
      formData.append('name', task.name);
      formData.append('description', task.description);
      formData.append('mesh', task.mesh);
      formData.append('thumbnail', task.thumbnail);
  
      setStateText('Uploading data');
      const response = await fetch(API_BASE_URL + '/api/projects/' + projectId + '/tasks', {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      setLoading(false);
      setStateText('Data uploaded');
  
      if (response.ok) navigate(-1);
      else throw new Error('Failed to create task');
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  return (
    <div className='flex justify-center align-middle w-full'>
      <div className='flex flex-col w-full'>
        { loading ?
          <div className='text-center'>
            Loading: {stateText}
          </div>
          :
          <TaskForm task={task} setTask={setTask} handleSubmit={createTask} />
        }
      </div>
    </div>
  );
}
