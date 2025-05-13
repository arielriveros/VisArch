import { ProjectApiResponse } from '@/api/types';
import { User } from '@/contexts/AuthContext';
import { Paper, Box, Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';

interface ProjectDetailsProps {
  project: ProjectApiResponse;
  user: User | null;
  onEdit: (projectId: string) => void;
  onDelete: () => void;
}
export default function ProjectDetails({ project, user, onEdit, onDelete }: ProjectDetailsProps) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  return (
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
          <Button variant='contained' color='secondary' onClick={() => onEdit(project._id)}>
            {t('projects.form.edit-project')}
          </Button>
          <Button variant='contained' color='error' onClick={onDelete}>
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
              onDelete();
            }}
            color='error'
          >
            {t('projects.form.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
