import { useEffect, useState } from 'react';
import Emitter from '../utils/emitter';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

export default function Progress() {
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onProgress = (current: number, total: number, text: string) => {
      setCurrent(current);
      setTotal(total);
      setText(text);
    };
    const onReady = () => setVisible(false); 
    Emitter.on('PROGRESS', onProgress);
    Emitter.on('READY', onReady);
    return () => {
      Emitter.off('PROGRESS', onProgress);
      Emitter.off('READY', onReady);
    };
  }, []);

  return (
    <Backdrop open={visible} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Typography color='white' variant='h6' gutterBottom>
          {text}
        </Typography>
        <CircularProgress variant='determinate' value={(current / total)} color='primary' />
      </Box>
    </Backdrop>
  );
}
