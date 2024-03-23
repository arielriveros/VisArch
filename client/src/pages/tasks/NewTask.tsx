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
    model: File | null; 
    thumbnail: File | null;
  }>({name: '', description: '', model: null, thumbnail: null});
  const [loading, setLoading] = useState(false);

  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
  
    try {
      console.log(task);
      if (!task.model || !task.thumbnail) return;
      setLoading(true);
      const formData = new FormData();
      formData.append('name', task.name);
      formData.append('description', task.description);
      formData.append('model', task.model);
      formData.append('thumbnail', task.thumbnail);
      formData.append('project', projectId as string);
  
      const response = await fetch(API_BASE_URL + '/api/tasks/', {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      setLoading(false);
  
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
          <div className='text-center'>Loading...</div>
          :
          <TaskForm task={task} setTask={setTask} handleSubmit={createTask} />
        }
      </div>
    </div>
  );
}
