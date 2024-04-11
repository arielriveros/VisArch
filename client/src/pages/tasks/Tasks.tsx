import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectApiResponse, TasksApiResponse } from '@/api/types';
import useFetch from '@/hooks/useFetch';
import TaskTable from '@/components/task-table/TaskTable';
import Button from '@/components/buttons/Button';

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
          <TaskTable tasks={tasks} />
          :
          <p className='text-md font-bold mt-4'>
            {t('tasks.no-tasks')}
          </p>
        }
      </div>
    </div>
  );
}
