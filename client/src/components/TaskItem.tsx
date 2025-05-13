import { TaskApiResponse } from '@/api/types';
import { Box, Typography, CircularProgress, Tooltip, IconButton, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import DownloadIcon from '@mui/icons-material/Download';

export default function TaskItem({ task, onDelete }: { task: TaskApiResponse; onDelete?: () => void }) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  const handleGoToTask = () => {
    navigate(`/task/${task._id}`);
  };

  const { execute } = useFetch({
    url: `/api/tasks/${task._id}`,
    options: {
      method: 'DELETE'
    },
    immediate: false,
    onSuccess: () => {
      if (onDelete) onDelete();
    },
    onError: () => {
      console.error('Error: ', 'Failed to delete task');
    },
  });

  const handleDeleteTask = () => {
    execute();
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`/api/files/tasks/${task._id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to download task');
      if (!response.body) throw new Error('Response body is null');
      const chunks: BlobPart[] = [];
      const reader = response.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${task.name}.zip`;
      a.click();
    }
    catch (error) {
      console.error('Error: ', error);
    }
    finally {
      setDownloading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        width: 250,
        height: 350,
        backgroundColor: '#f5f5f5',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingRight: 2,
        position: 'absolute',
        top: 0,
        zIndex: 1 
      }}>
        <Typography variant='h6'>
          {task.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {
            downloading ? 
              <CircularProgress 
                variant='indeterminate'
                thickness={5}
              />
              :
              <Tooltip title={t('tasks.download')}>
                <IconButton
                  onClick={handleDownload}
                  size='medium'
                  color='primary'
                  aria-label={t('tasks.download')}>
                  <DownloadIcon />
                </IconButton>
                
              </Tooltip>
          }
        </Box>
      </Box>
      <img
        src={`api/files/images/${task.thumbnail}`}
        alt='thumbnail'
        style={{ width: '100%', height: '100%', margin: '0 auto', maxHeight: '10rem' }}
      />
      <Typography
        sx={{
          height: '5rem',
          overflowY: 'auto'
        }}
      >
        {task.description !== '' ? task.description : <i>{t('tasks.no-description')}</i>}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>
            <strong>{t('annotation.archetypes')}:</strong> {task.annotations.length}
          </Typography>
          <Typography>
            <strong>{t('annotation.entities')}:</strong>{' '}
            {task.annotations.reduce((acc, curr) => acc + curr.entities.length, 0)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='outlined' color='primary' onClick={handleGoToTask}>
            {t('tasks.annotate')}
          </Button>
          <Button variant='outlined' color='warning' onClick={handleDeleteTask}>
            {t('tasks.delete')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}