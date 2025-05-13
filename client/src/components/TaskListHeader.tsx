import { Typography, Box, Button } from '@mui/material';
import { t } from 'i18next';

interface TaskListHeaderProps {
  title: string
  onGoBack: () => void
  onOpenForm: () => void
}
export default function TaskListHeader({ title, onGoBack, onOpenForm }: TaskListHeaderProps) {
  return (
    <>
      <Typography variant='h4' gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant='outlined'
          color='primary'
          onClick={onGoBack}
        >
          {t('tasks.go-back')}
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={onOpenForm}
        >
          {t('tasks.add-task')}
        </Button>
      </Box>
    </>
  );
}
