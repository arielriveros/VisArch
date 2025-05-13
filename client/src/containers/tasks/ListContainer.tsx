import { TaskApiResponse } from '@/api/types';
import TaskItem from '@/components/TaskItem';
import { Box, Grid, Typography } from '@mui/material';
import { t } from 'i18next';

interface TaskListContainerProps {
  tasks: TaskApiResponse[];
  execute: () => void;
}
export default function TaskListContainer({ tasks, execute }: TaskListContainerProps) {
  return (
    <Box sx={{ width: '100%', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
      {tasks.length !== 0 ? (
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <TaskItem task={task} key={task._id} onDelete={execute} />
          ))}
        </Grid>
      ) : (
        <Typography variant='body1' align='center'>
          {t('tasks.no-tasks')}
        </Typography>
      )}
    </Box>
  );
}
