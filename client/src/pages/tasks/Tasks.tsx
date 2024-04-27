import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectApiResponse, TaskApiResponse, TasksApiResponse } from '@/api/types';
import { API_BASE_URL } from '@/api/config';
import useFetch from '@/hooks/useFetch';
import Button from '@/components/buttons/Button';
import Grid, { GridElement } from '@/components/grid/Grid';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import ProgressBar from '@/components/ProgressBar';

function TaskItem({ task }: { task: TaskApiResponse }) {
  const { t } = useTranslation();
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
    <GridElement key={task._id}>
      <div className='flex flex-col w-full h-full p-4 bg-dark-blue border border-light-blue rounded'>
        <p className='text-lg font-bold text-center'>{ task.name }</p>
        <img src={`${API_BASE_URL}/api/files/images/${task.thumbnail}`}  alt='thumbnail' className='w-3/4 h-3/4 mx-auto' />
        <p>{ task.description !== '' ? task.description : <i>{t('tasks.no-description')}</i> } </p>
        <ul>
          <li>
            {t('annotation.archetypes')}: {task.annotations.length}
          </li>
          <li>
            {t('annotation.entities')}: {task.annotations.reduce((acc, curr) => acc + curr.entities.length, 0)}
          </li>
        </ul>
        <span className='flex'>
          <Button onClick={handleGoToTask}>{t('tasks.annotate')}</Button>
          <ConfirmButton label={t('tasks.delete')} onConfirm={() => handleDeleteTask()} />
        </span>
        <span className='flex justify-center'>
          {
            downloading ?
              <ProgressBar current={current === 0 ? null : current} total={total} />
              :
              <Button onClick={handleDownload}>{t('tasks.download')}</Button>
          }
        </span>
        
      </div>
    </GridElement>
  );
}

export default function Tasks() {
  const { projectId } = useParams();
  const { loading: loadingTasks, data: tasksData } = useFetch<TasksApiResponse>('api/projects/'+projectId+'/tasks', { credentials: 'include' });
  const { loading: loadingProject, data: projectData } = useFetch<ProjectApiResponse>('api/projects/'+projectId, { credentials: 'include' });
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<TasksApiResponse>([]);
  const [project, setProject] = useState<ProjectApiResponse>();

  const navigate = useNavigate();

  useEffect(() => {
    if (tasksData && !loadingTasks)
      setTasks(tasksData);
    if (projectData && !loadingProject)
      setProject(projectData);
  }, [loadingTasks, tasksData, loadingProject, projectData]);

  if (loadingTasks || loadingProject) { return <div>
    {t('tasks.loading')}
  </div>; }

  return (
    <div className='flex flex-col w-full h-full p-4 justify-center items-center'>
      <h2 className='text-2xl font-bold'>{project?.name}</h2>
      <section className='flex flex-row justify-evenly w-1/3 gap-10'>
        <Button onClick={() => navigate(`/projects/${projectId}/details`)}>
          {t('tasks.details')}
        </Button>
        <Button onClick={() => navigate(`/projects/${projectId}/new-task`)}>
          {t('tasks.add-task')}
        </Button>
      </section>
      <div className='flex flex-col w-2/3 m-2 justify-center items-center overflow-auto'>
        { !loadingTasks && tasks.length !== 0 ? 
          <div className='flex flex-col w-full'>
            <Grid>{tasks?.map((task) => 
              <TaskItem task={task} key={task._id} />)}
            </Grid>
          </div>
          :
          <p className='text-md font-bold mt-4'>
            {t('tasks.no-tasks')}
          </p>
        }
      </div>
    </div>
  );
}
