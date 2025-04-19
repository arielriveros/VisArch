import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectsApiResponse } from '@/api/types';
import { Button, Dialog, Snackbar, Alert, Typography, Paper } from '@mui/material';
import useSession from '@/hooks/useSession';
import useFetch from '@/hooks/useFetch';
import ProjectTable from '@/components/ProjectTable';
import ProjectDetails from '@/components/ProjectDetails';
import ProjectFormContainer from '../components/ProjectForm';

export default function Projects() {
  const { user } = useSession();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { execute } = useFetch<ProjectsApiResponse>({
    url: `/api/users/${user?.id}/projects`,
    options: {
      method: 'GET',
      credentials: 'include',
    },
    onSuccess: (data) => {
      setProjects(data);
    },
    onError: (error) => {
      console.error('Failed to fetch projects', error);
    },
  });

  const [projects, setProjects] = useState<ProjectsApiResponse>([]);
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
    <Paper elevation={3} sx={{ width: '90%', maxHeight: '80vh', p: 4, mx: 'auto', mt: 4, overflow: 'auto' }}>
      <Typography variant="h4" component="p"  fontWeight="bold">
        {t('projects.title')}
      </Typography>
      <div className="flex justify-end mb-2">
        <Button variant="contained" color="primary" onClick={handleNewProject}>
          {t('projects.form.new-project')}
        </Button>
      </div>
      {user?.id && (
        projects.length < 1 ? 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant="h6" component="p">
              {t('projects.no-projects-found')}
            </Typography>
          </div>
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
    </Paper>
  );
}
