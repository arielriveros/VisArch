import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectApiResponse } from '@/api/types';
import { API_BASE_URL } from '@/api/config';
import useSession from '@/hooks/useSession';
import useFetch from '@/hooks/useFetch';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useSession();
  const { loading, data } = useFetch<ProjectApiResponse>('api/projects/' + projectId, { credentials: 'include' });
  const [project, setProject] = useState<ProjectApiResponse>();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (data && !loading) setProject(data);
  }, [loading, data]);

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(API_BASE_URL + '/api/projects/' + projectId, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        navigate(-1);
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  return (
    project && (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
        <Paper elevation={3} sx={{ width: '50%', padding: 4, marginTop: 4 }}>
          <Typography variant="h4" gutterBottom>
            {project.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>{t('projects.owner')}:</strong> {project.owner.displayName} (
            {user?.id === project.owner._id ? t('projects.owner-you') : project.owner.email})
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>{t('projects.collaborators')}:</strong>
          </Typography>
          <List>
            {project.collaborators.map((collaborator) => (
              <ListItem key={collaborator._id}>
                <ListItemText
                  primary={`${collaborator.displayName} (${collaborator._id === project.owner._id ? 'Owner' : collaborator.email})`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1" gutterBottom>
            <strong>{t('projects.description')}:</strong>{' '}
            {project.description !== '' ? project.description : <i>{t('projects.no-description')}</i>}
          </Typography>
          {user?.id === project.owner._id && (
            <Box display="flex" justifyContent="space-between" marginTop={2}>
              <Button variant="contained" color="primary" onClick={() => navigate(`/projects/${projectId}/edit`)}>
                {t('projects.form.edit-project')}
              </Button>
              <Button variant="contained" color="error" onClick={() => setOpenConfirmDialog(true)}>
                {t('projects.form.delete-project')}
              </Button>
            </Box>
          )}
        </Paper>

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>{t('projects.form.delete-confirm-title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('projects.form.delete-confirm-message')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>{t('projects.form.cancel')}</Button>
            <Button
              onClick={() => {
                setOpenConfirmDialog(false);
                handleDeleteProject();
              }}
              color="error"
            >
              {t('projects.form.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
}
