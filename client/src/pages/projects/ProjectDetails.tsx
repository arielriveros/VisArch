import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface ProjectDetailsProps {
  projectId: string;
}
export default function ProjectDetails(props: ProjectDetailsProps) {
  const { user } = useSession();
  const { loading, data } = useFetch<ProjectApiResponse>('api/projects/' + props.projectId, { credentials: 'include' });
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
      const response = await fetch(API_BASE_URL + '/api/projects/' + props.projectId, {
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
      <Paper elevation={3} sx={{ padding: 4 }} component={Box} maxWidth={600} margin="auto">
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
            <Button variant="contained" color="primary" onClick={() => navigate(`/projects/${props.projectId}/edit`)}>
              {t('projects.form.edit-project')}
            </Button>
            <Button variant="contained" color="error" onClick={() => setOpenConfirmDialog(true)}>
              {t('projects.form.delete-project')}
            </Button>
          </Box>
        )}
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
      </Paper>
    )
  );
}
