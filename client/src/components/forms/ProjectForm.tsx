import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextField, Typography, Paper, List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProjectFormProps {
  title: string;
  project: {
    name: string;
    description: string;
    collaborators: { displayName: string; email: string; id: string }[];
  };
  setProject: (project: {
    name: string;
    description: string;
    collaborators: { displayName: string; email: string; id: string }[];
  }) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  usersList: { displayName: string; email: string; id: string }[];
  onCancel: () => void;
}

export default function ProjectForm(props: ProjectFormProps) {
  const { title, project, usersList, setProject, handleSubmit } = props;
  const [search, setSearch] = useState<string>('');
  const [filteredUsersList, setFilteredUsersList] = useState(usersList);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleCloseDialog = () => setOpen(false);
  const handleOpenDialog = () => setOpen(true);

  useEffect(() => {
    const filteredList = usersList.filter((user) =>
      user.displayName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsersList(filteredList);
  }, [usersList, search]);

  const handleSetCollaborators = (collaborators: { id: string; displayName: string; email: string }[]) => {
    setProject({ ...project, collaborators });
  };


  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant='h5' gutterBottom>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t('projects.name')}
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          required
          slotProps={{
            htmlInput: { maxLength: 20 },
          }}
          margin='normal'
        />

        <TextField
          fullWidth
          label={t('projects.description')}
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          slotProps={{
            htmlInput: { maxLength: 100 },
          }}
          multiline
          rows={3}
          margin='normal'
        />

        <TextField
          fullWidth
          label={t('projects.collaborators')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          margin='normal'
        />

        {filteredUsersList.length > 0 && search && (
          <List sx={{ maxHeight: 150, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 1 }}>
            {filteredUsersList.map((user) => (
              project.collaborators.find((c) => c.id === user.id) ? null : (
                <ListItem
                  component="button"
                  key={user.id}
                  onClick={() => {
                    handleSetCollaborators([...project.collaborators, user]);
                    setSearch('');
                  }}
                >
                  <ListItemText primary={user.displayName} secondary={user.email} />
                </ListItem>
              )
            ))}
          </List>
        )}

        <List>
          {project.collaborators.map((collaborator) => (
            <ListItem key={collaborator.id} secondaryAction={
              <IconButton edge='end' onClick={() => handleSetCollaborators(project.collaborators.filter((c) => c.id !== collaborator.id))}>
                <DeleteIcon color='error' />
              </IconButton>
            }>
              <ListItemText primary={collaborator.displayName} secondary={collaborator.email} />
            </ListItem>
          ))}
        </List>

        <div className='flex justify-center items-center mt-5'>
          <Button onClick={() => props.onCancel} variant='outlined' sx={{ mr: 2 }}>
            {t('projects.form.cancel')}
          </Button>
          <Button onClick={handleOpenDialog} variant='contained'>
            {t('projects.form.submit')}
          </Button>
        </div>

        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>{t('tasks.confirmation.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('tasks.confirmation.message')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('tasks.confirmation.cancel')}</Button>
            <Button
              onClick={(e) => {
                handleCloseDialog();
                handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }}
              variant='contained'
            >
              {t('tasks.confirmation.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </form>

    </Paper>
  );
}
