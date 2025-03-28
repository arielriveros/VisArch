import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectApiResponse, TaskApiResponse, TasksApiResponse } from '@/api/types';
import { API_BASE_URL } from '@/api/config';
import useFetch from '@/hooks/useFetch';
import {
  Button,
  IconButton,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Tooltip,
  Dialog,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TaskFormContainer from '@/components/TaskForm';

function TaskItem({ task }: { task: TaskApiResponse }) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
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
      if (!response.body) throw new Error('Response body is null');
      const chunks: Uint8Array[] = [];
      const reader = response.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${task.name}.zip`;
      a.click();
    }
    catch (error) {
      console.error('Error: ', error);
    }
    finally {
      setDownloading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        width: 250,
        height: 350,
        backgroundColor: '#f5f5f5',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingRight: 2,
        position: 'absolute',
        top: 0,
        zIndex: 1 
      }}>
        <Typography variant='h6'>
          {task.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {
            downloading ? 
              <CircularProgress 
                variant='indeterminate'
                thickness={5}
              />
              :
              <Tooltip title={t('tasks.download')}>
                <IconButton
                  onClick={handleDownload}
                  size='medium'
                  color='primary'
                  aria-label={t('tasks.download')}>
                  <DownloadIcon />
                </IconButton>
                
              </Tooltip>
          }
        </Box>
      </Box>
      <img
        src={`${API_BASE_URL}/api/files/images/${task.thumbnail}`}
        alt='thumbnail'
        style={{ width: '100%', height: '100%', margin: '0 auto', maxHeight: '10rem' }}
      />
      <Typography
        sx={{
          height: '5rem',
          overflowY: 'auto'
        }}
      >
        {task.description !== '' ? task.description : <i>{t('tasks.no-description')}</i>}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>
            <strong>{t('annotation.archetypes')}:</strong> {task.annotations.length}
          </Typography>
          <Typography>
            <strong>{t('annotation.entities')}:</strong>{' '}
            {task.annotations.reduce((acc, curr) => acc + curr.entities.length, 0)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='outlined' color='primary' onClick={handleGoToTask}>
            {t('tasks.annotate')}
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleDeleteTask}>
            {t('tasks.delete')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function Tasks() {
  const { projectId } = useParams();
  const { loading: loadingTasks, data: tasksData, execute } = useFetch<TasksApiResponse>(
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

  const [showForm, setShowForm] = useState(false);
  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleSaveSuccess = useCallback(() => {
    execute();
    handleCloseForm();
  }, [execute]);

  useEffect(() => {
    if (tasksData && !loadingTasks) setTasks(tasksData);
    if (projectData && !loadingProject) setProject(projectData);
  }, [loadingTasks, tasksData, loadingProject, projectData]);

  if (loadingTasks || loadingProject) {
    return <CircularProgress />;
  }

  return (
    <Paper
      elevation={3}
      sx={{ 
        width: '90%',
        maxHeight: '80vh',
        p: 4,
        mx: 'auto',
        mt: 4,
        overflow: 'auto'
      }}
    >
      <Typography variant='h4' gutterBottom>
        {project?.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant='contained'
          onClick={() => navigate(-1)}
        >
          {t('tasks.go-back')}
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={handleOpenForm}
        >
          {t('tasks.add-task')}
        </Button>
      </Box>
      <Box sx={{ width: '100%', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
        {tasks.length !== 0 ? (
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <TaskItem task={task} key={task._id} />
            ))}
          </Grid>
        ) : (
          <Typography variant='body1' align='center'>
            {t('tasks.no-tasks')}
          </Typography>
        )}
      </Box>
      {showForm && project && (
        <Dialog open={showForm} onClose={handleCloseForm}>
          <TaskFormContainer
            projectId={project._id}
            onClose={handleCloseForm}
            onSaveSuccess={handleSaveSuccess}
          />
        </Dialog>
      )}
    </Paper>
  );
}
