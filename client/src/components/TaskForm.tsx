import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '@/api/config';
import useSession from '@/hooks/useSession';
import TaskForm from '@/components/forms/TaskForm';
import { CircularProgress } from '@mui/material';

interface TaskFormContainerProps {
  projectId: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function TaskFormContainer(props: TaskFormContainerProps) {
  const { user } = useSession();
  const [task, setTask] = useState<{
    name: string;
    description:
    string,
    mesh: File | null; 
    thumbnail: File | null;
  }>({name: '', description: '', mesh: null, thumbnail: null});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const createTask = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
  
    try {
      if (!task.mesh || !task.thumbnail) return;
      setLoading(true);
      const formData = new FormData();
      formData.append('name', task.name);
      formData.append('description', task.description);
      formData.append('mesh', task.mesh);
      formData.append('thumbnail', task.thumbnail);

      await fetch(API_BASE_URL + '/api/projects/' + props.projectId + '/tasks', {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      setLoading(false);
      props.onSaveSuccess();
      props.onClose();
  
    } catch (error) {
      console.error('Error: ', error);
    }
  }, [task, user, props]);

  return (
    <div className='flex justify-center align-middle w-full'>
      <div className='flex flex-col w-full'>
        { loading ?
          <div className='text-center'>
            <CircularProgress />
            {t('tasks.uploading')}
          </div>
          :
          <TaskForm
            task={task}
            setTask={setTask}
            handleSubmit={createTask}
            handleCancel={props.onClose}
          />
        }
      </div>
    </div>
  );
}
