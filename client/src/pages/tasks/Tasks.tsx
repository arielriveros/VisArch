import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProjectApiResponse, TasksApiResponse } from '@/api/types';
import useFetch from '@/hooks/useFetch';
import TaskTable from '@/components/task-table/TaskTable';
import useSession from '@/hooks/useSession';

export default function Tasks() {
  const { projectId } = useParams();
  const { user } = useSession();
  const { loading: loadingTasks, data: tasksData } = useFetch<TasksApiResponse>('api/tasks/fromProject/'+projectId, { credentials: 'include' });
  const { loading: loadingProject, data: projectData } = useFetch<ProjectApiResponse>('api/projects/'+projectId, { credentials: 'include' });

  const [tasks, setTasks] = useState<TasksApiResponse>([]);
  const [project, setProject] = useState<ProjectApiResponse>();

  const navigate = useNavigate();

  useEffect(() => {
    if (tasksData && !loadingTasks)
      setTasks(tasksData);
  }, [loadingTasks, tasksData]);

  useEffect(() => {
    if (projectData && !loadingProject)
      setProject(projectData);
  }, [loadingProject, projectData]);

  if (loadingTasks || loadingProject) { return <div>Loading...</div>; }

  const gotoNewTask = () => {
    navigate(`/projects/${projectId}/new`);
  };

  return (
    <div className='flex flex-row w-full h-full'>
      <div className='flex flex-col w-1/3 m-2 pl-4 justify-center items-center float-left bg-dark-blue rounded-sm'>
        <span className='flex flex-col w-full mb-4 justify-evenly'>
          <span className='text-2xl font-bold mb-4'>{project?.name}</span>
          <span><b>Owner:</b> {project?.owner.name} ({user?.id === project?.owner._id ? 'You' : project?.owner.email})</span>
          <span>
            <span><b>Collaborators:</b></span>
            <ul className='list-disc list-inside'>
              {project?.collaborators.map((collaborator) => (
                <li key={collaborator._id}>{collaborator.name} ({collaborator._id === project?.owner._id ? 'Owner' : collaborator.email})</li>
              ))}
            </ul>
          </span>
          <span><b>Description:</b> {project?.description}</span>
        </span>
      </div>
      <div className='flex flex-col w-2/3 m-2 justify-center items-center overflow-auto'>
        <button className='bg-blue rounded-md p-1 mt-3 m-2' onClick={gotoNewTask}>Add task</button>
        {!loadingTasks && tasks.length !== 0 ? 
          <TaskTable tasks={tasks} />
          :
          <p className='text-md font-bold mt-4'>No tasks found</p>
        }
      </div>
    </div>
  );
}
