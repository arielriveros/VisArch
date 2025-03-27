import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectsApiResponse } from '@/api/types';
import { Button, Dialog, Snackbar, Alert, Typography, Box } from '@mui/material';
import useSession from '@/hooks/useSession';
import useFetch from '@/hooks/useFetch';
import ProjectTable from '@/components/ProjectTable';
import ProjectDetails from '@/components/ProjectDetails';
import ProjectFormContainer from '../components/ProjectForm';

export default function Projects() {
  const { user } = useSession();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { data, loading, status, error, execute } = useFetch<ProjectsApiResponse>(
    `api/users/${user?.id}/projects`,
    { credentials: 'include' }
  );
  const [projects, setProjects] = useState<ProjectsApiResponse>([]);

  useEffect(() => {
    if (!data || loading) return;
    if (status !== 200) {
      console.error('Failed to fetch projects', error);
      return;
    }
    setProjects(data);
  }, [data, loading, status, error]);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOnRowClick = (projectId: string) => navigate(`/projects/${projectId}/tasks`);
  const handleOnDetailsClick = (projectId: string) => {
    setSelectedProject(projectId);
    setShowDetails(true);
  };
  const handleOnEditClick = (projectId: string) => {
    setSelectedProject(projectId);
    setShowForm(true);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage(null);
  };

  const handleDeleteSuccess = () => {
    setSnackbarMessage(t('projects.success-deletion'));
    setSnackbarOpen(true);
    execute();
  };

  const handleSaveSuccess = () => {
    setSnackbarMessage(t('projects.success-creation'));
    setSnackbarOpen(true);
    execute();
  };

  return (
    <Box className='flex flex-col w-full h-full p-4 justify-center items-center'>
      <Typography variant="h4" component="p" className='mb-4' fontWeight="bold">
        {t('projects.title')}
      </Typography>
      <Box className='mb-4'>
        <Button variant="contained" color="primary" onClick={handleNewProject}>
          {t('projects.form.new-project')}
        </Button>
      </Box>
      {user?.id && projects && (
        projects.length < 1 ? 
          <Typography variant="h6" component="p">
            {t('projects.no-projects-found')}
          </Typography>
          :
          <ProjectTable
            userId={user.id}
            projects={projects}
            onRowClick={handleOnRowClick}
            onDetailsClick={handleOnDetailsClick}
            onEditClick={handleOnEditClick}
          />
      )}
      {showDetails && selectedProject && (
        <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
          <ProjectDetails
            projectId={selectedProject}
            onClose={() => setShowDetails(false)}
            onEditClick={handleOnEditClick}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </Dialog>
      )}
      {showForm && (
        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <ProjectFormContainer
            projectId={selectedProject}
            onClose={() => setShowForm(false)}
            onSaveSuccess={handleSaveSuccess}
          />
        </Dialog>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
