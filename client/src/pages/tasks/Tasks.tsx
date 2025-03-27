import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectApiResponse, TaskApiResponse, TasksApiResponse } from '@/api/types';
import { API_BASE_URL } from '@/api/config';
import useFetch from '@/hooks/useFetch';
import {
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
} from '@mui/material';

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

      if (!response.ok) throw new Error('Failed to download task');

      const totalSize = Number(response.headers.get('Content-Length'));
      setTotal(totalSize);
      let loadedSize = 0;
      setCurrent(loadedSize);

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

      const blob = new Blob(chunks);
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
    <Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          border: '1px solid #90caf9',
          borderRadius: 2,
          backgroundColor: '#0d47a1',
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          {task.name}
        </Typography>
        <img
          src={`${API_BASE_URL}/api/files/images/${task.thumbnail}`}
          alt="thumbnail"
          style={{ width: '75%', height: '75%', margin: '0 auto' }}
        />
        <Typography>
          {task.description !== '' ? task.description : <i>{t('tasks.no-description')}</i>}
        </Typography>
        <ul>
          <li>
            {t('annotation.archetypes')}: {task.annotations.length}
          </li>
          <li>
            {t('annotation.entities')}:{' '}
            {task.annotations.reduce((acc, curr) => acc + curr.entities.length, 0)}
          </li>
        </ul>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}></Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleGoToTask}>
            {t('tasks.annotate')}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteTask}
          >
            {t('tasks.delete')}
          </Button>
        </Box>
        {downloading ? (
          <LinearProgress
            variant="determinate"
            value={(current / total) * 100}
            sx={{ width: '100%' }}
          />
        ) : (
          <Button variant="contained" onClick={handleDownload}>
            {t('tasks.download')}
          </Button>
        )}
      </Box>
    </Grid>
  );
}

export default function Tasks() {
  const { projectId } = useParams();
  const { loading: loadingTasks, data: tasksData } = useFetch<TasksApiResponse>(
    'api/projects/' + projectId + '/tasks',
    { credentials: 'include' }
  );
  const { loading: loadingProject, data: projectData } = useFetch<ProjectApiResponse>(
    'api/projects/' + projectId,
    { credentials: 'include' }
  );
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<TasksApiResponse>([]);
  const [project, setProject] = useState<ProjectApiResponse>();

  const navigate = useNavigate();

  useEffect(() => {
    if (tasksData && !loadingTasks) setTasks(tasksData);
    if (projectData && !loadingProject) setProject(projectData);
  }, [loadingTasks, tasksData, loadingProject, projectData]);

  if (loadingTasks || loadingProject) {
    return <CircularProgress />;
  }

  return (
    <div className='flex flex-col w-full h-full p-4 justify-center items-center'>
      <Typography variant="h4" gutterBottom>
        {project?.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate(`/projects/${projectId}/new-task`)}
        >
          {t('tasks.add-task')}
        </Button>
      </Box>
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        {tasks.length !== 0 ? (
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <TaskItem task={task} key={task._id} />
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">
            {t('tasks.no-tasks')}
          </Typography>
        )}
      </Box>
    </div>
  );
}
