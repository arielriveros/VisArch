import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectApiResponse, TasksApiResponse } from '@/api/types';
import useFetch from '@/hooks/useFetch';
import TaskFormContainer from '@/containers/tasks/FormContainer';
import {
  Box,
  CircularProgress,
  Paper,
  Dialog,
} from '@mui/material';
import TaskListContainer from '@/containers/tasks/ListContainer';
import TaskListHeader from '@/components/TaskListHeader';


export default function Tasks() {
  const { projectId } = useParams();
  const { loading: loadingTasks, execute } = useFetch<TasksApiResponse>({
    url: 'api/projects/' + projectId + '/tasks',
    options: {
      method: 'GET',
      credentials: 'include',
    },
    onSuccess: (data) => {
      setTasks(data);
    }
  });

  const { loading: loadingProject } = useFetch<ProjectApiResponse>({
    url: 'api/projects/' + projectId,
    options: {
      method: 'GET',
      credentials: 'include',
    },
    onSuccess: (data) => {
      setProject(data);
    }
  });

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

  if (loadingTasks || loadingProject) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={100} color='primary' />
    </Box>;
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
      <TaskListHeader title={project?.name || ''} onGoBack={() => navigate(-1)} onOpenForm={handleOpenForm} />
      <TaskListContainer tasks={tasks} execute={execute} />
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
