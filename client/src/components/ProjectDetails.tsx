import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectApiResponse } from '@/api/types';
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
  onEditClick: (projectId: string) => void;
  onClose: () => void;
  onDeleteSuccess: () => void;
}
export default function ProjectDetails(props: ProjectDetailsProps) {
  const { user } = useSession();
  const [project, setProject] = useState<ProjectApiResponse>();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { t } = useTranslation();

  const { loading } = useFetch<ProjectApiResponse>({
    url: '/api/projects/' + props.projectId,
    options: {
      method: 'GET',
      credentials: 'include',
    },
    immediate: true,
    onSuccess: (data) => {
      console.log('Project details: ', data);
      setProject(data);
    },
  });

  if (loading) {
    return <Typography variant='h6' align='center'>Loading...</Typography>;
  }

  const { execute } = useFetch({
    url: `/api/projects/${props.projectId}`,
    options: {
      method: 'DELETE',
      credentials: 'include',
    },
    immediate: false,
    onSuccess: () => {
      props.onDeleteSuccess();
      props.onClose();
    },
    onError: () => {
      console.error('Error: ', 'Failed to delete project');
    },
  });

  return (
    project && (
      <Paper elevation={3} sx={{ padding: 2 }} component={Box} width={350} margin='auto' maxHeight='80vh' overflow='auto'>
        <Typography variant='h4' gutterBottom>
          {project.name}
        </Typography>
        <Typography variant='body1' gutterBottom>
          <strong>{t('projects.owner')}:</strong> {project.owner.displayName} (
          {user?.id === project.owner._id ? t('projects.owner-you') : project.owner.email})
        </Typography>
        <Typography variant='body1' gutterBottom>
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
        <Typography variant='body1' gutterBottom>
          <strong>{t('projects.description')}:</strong>{' '}
          {project.description !== '' ? project.description : <i>{t('projects.no-description')}</i>}
        </Typography>
        {user?.id === project.owner._id && (
          <Box display='flex' justifyContent='space-between' marginTop={2}>
            <Button variant='contained' color='secondary' onClick={() => props.onEditClick(project._id)}>
              {t('projects.form.edit-project')}
            </Button>
            <Button variant='contained' color='error' onClick={() => setOpenConfirmDialog(true)}>
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
                execute();
              }}
              color='error'
            >
              {t('projects.form.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    )
  );
}
