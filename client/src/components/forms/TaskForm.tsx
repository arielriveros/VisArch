import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, TextField, Typography, Paper, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MeshInput from '@/components/mesh-input/MeshInput';

interface TaskFormProps {
  task: {
    name: string;
    description: string;
    mesh: File | null;
    thumbnail: File | null;
  };
  setTask: (task: {
    name: string;
    description: string;
    mesh: File | null;
    thumbnail: File | null;
  }) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function TaskForm(props: TaskFormProps) {
  const { task, setTask, handleSubmit } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const goBack = () => {
    navigate(-1);
  };

  const handleMesh = (glbFile: File, screenshot: File) => {
    setTask({ ...task, mesh: glbFile, thumbnail: screenshot });
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant='h5' gutterBottom>
        {t('tasks.create-task')}
      </Typography>
      <form>
        <TextField
          fullWidth
          label={t('tasks.name')}
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          required
          inputProps={{ maxLength: 20 }}
          margin='normal'
        />
        <TextField
          fullWidth
          label={t('tasks.description')}
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          required
          inputProps={{ maxLength: 100 }}
          multiline
          rows={3}
          margin='normal'
        />
        <Box sx={{ mt: 3, mb: 3 }}>
          <MeshInput handleMesh={handleMesh} />
        </Box>
        <div className='flex justify-center items-center mt-5'>
          <Button onClick={goBack} variant='outlined' sx={{ mr: 2 }}>
            {t('tasks.form.cancel')}
          </Button>
          <Button onClick={handleOpenDialog} variant='contained'>
            {t('tasks.form.submit')}
          </Button>
        </div>
      </form>

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
    </Paper>
  );
}