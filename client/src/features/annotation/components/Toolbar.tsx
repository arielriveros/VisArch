import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, ToggleButton, ToggleButtonGroup, Button, Box } from '@mui/material';
import useConfig from '../hooks/useConfig';
import Emitter from '../utils/emitter';
import DragIcon from '@/assets/icons/drag.png';
import RotateIcon from '@/assets/icons/rotate.png';
import ZoomIcon from '@/assets/icons/zoom.png';
import LassoIcon from '@/assets/icons/lasso.png';

export default function Toolbar() {
  const { tool, setTool, unwrapping, setUnwrapping } = useConfig();
  const { t } = useTranslation();

  useEffect(() => {
    if (unwrapping !== 'none') Emitter.emit('RESET');
  }, [unwrapping]);

  const handleToolChange = (_: React.MouseEvent<HTMLElement>, newTool: 'drag' | 'rotate' | 'zoom' | 'lasso' | null) => {
    if (newTool !== null) setTool(newTool);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '60px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* <Typography variant='subtitle1' sx={{ marginRight: '10px' }}>
        {t('toolbar.controls')}
      </Typography> */}
      <ToggleButtonGroup
        value={tool}
        exclusive
        onChange={handleToolChange}
        aria-label='tool selection'
        size='small'
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ToggleButton value='drag' title={t('toolbar.drag')} aria-label='drag'>
          <img src={DragIcon} alt='Drag' className='w-[40px] h-[40px] p-2' />
        </ToggleButton>
        <ToggleButton value='rotate' title={t('toolbar.rotate')} aria-label='rotate'>
          <img src={RotateIcon} alt='Rotate' className='w-[40px] h-[40px] p-2' />
        </ToggleButton>
        <ToggleButton value='zoom' title={t('toolbar.zoom')} aria-label='zoom'>
          <img src={ZoomIcon} alt='Zoom' className='w-[40px] h-[40px] p-2' />
        </ToggleButton>

        {/* <Typography variant='subtitle1' sx={{ marginRight: '10px' }}>
          {t('toolbar.tools')}
        </Typography> */}
        <ToggleButton value='lasso' title={t('toolbar.lasso')} aria-label='lasso'>
          <img src={LassoIcon} alt='Lasso' className='w-[40px] h-[40px] p-2' />
        </ToggleButton>
      </ToggleButtonGroup>
      <Button
        onClick={() => Emitter.emit('RESET')}
        title={t('toolbar.reset')}
      >
        {t('toolbar.reset')}
      </Button>
      <Box sx={{ width: '100px', marginLeft: '10px' }}>
        <label htmlFor='unwrapping-select'>{t('toolbar.unwrapping')}</label>
        <select
          id='unwrapping-select'
          value={unwrapping}
          onChange={(e) => setUnwrapping(e.target.value as 'none' | 'x' | 'y' | 'z')}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value='none'>-</option>
          <option value='x'>X</option>
          <option value='y'>Y</option>
          <option value='z'>Z</option>
        </select>
      </Box>
      <Button
        onClick={() => Emitter.emit('SAVE')}
        variant="contained"
        color="primary"
        sx={{ marginLeft: '10px' }}
      >
        {t('toolbar.save')}
      </Button>
    </Paper>
  );
}
