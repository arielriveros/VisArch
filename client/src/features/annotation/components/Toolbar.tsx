import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useConfig from '../hooks/useConfig';
import Emitter from '../utils/emitter';
import DragIcon from '@/assets/icons/drag.png';
import RotateIcon from '@/assets/icons/rotate.png';
import ZoomIcon from '@/assets/icons/zoom.png';
import LassoIcon from '@/assets/icons/lasso.png';
import { Button, Card, Typography, Select, MenuItem } from '@mui/material';

export default function Toolbar() {
  const { tool, setTool, unwrapping, setUnwrapping } = useConfig();
  const { t } = useTranslation();

  useEffect(() => {
    if (unwrapping !== 'none') Emitter.emit('RESET');
  }, [unwrapping]);

  return (
    <Card
      sx={{
        position: 'absolute',
        bottom: 0,
        right: 25,
        zIndex: 100,
        padding: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Button
        onClick={() => Emitter.emit('SAVE')}
        variant="contained"
        color="primary"
      >
        {t('toolbar.save')}
      </Button>
      <div className="flex flex-col">
        <div className="flex">
          <Typography variant="subtitle1" className="group-label">
            {t('toolbar.controls')}
          </Typography>
          <Button
            className={`toolbar-button ${tool === 'drag' ? 'active' : ''}`}
            onClick={() => setTool('drag')}
            title={t('toolbar.drag')}
          >
            <img className="toolbar-icon" src={DragIcon} alt="Drag" />
          </Button>
          <Button
            className={`toolbar-button ${tool === 'rotate' ? 'active' : ''}`}
            onClick={() => setTool('rotate')}
            title={t('toolbar.rotate')}
          >
            <img className="toolbar-icon" src={RotateIcon} alt="Rotate" />
          </Button>
          <Button
            className={`toolbar-button ${tool === 'zoom' ? 'active' : ''}`}
            onClick={() => setTool('zoom')}
            title={t('toolbar.zoom')}
          >
            <img className="toolbar-icon" src={ZoomIcon} alt="Zoom" />
          </Button>
          <Button
            className="toolbar-button"
            onClick={() => Emitter.emit('RESET')}
            title={t('toolbar.reset')}
          >
            {t('toolbar.reset')}
          </Button>
        </div>
        <div className="flex flex-col">
          <div className="flex">
            <Typography variant="subtitle1" className="group-label">
              {t('toolbar.tools')}
            </Typography>
            <Button
              className={`toolbar-button ${tool === 'lasso' ? 'active' : ''}`}
              onClick={() => setTool('lasso')}
              title={t('toolbar.lasso')}
            >
              <img className="toolbar-icon" src={LassoIcon} alt="Lasso" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex">
            <Typography variant="subtitle1" className="group-label">
              {t('toolbar.unwrapping')}
            </Typography>
            <Select
              className="toolbar-select"
              value={unwrapping}
              onChange={(e) => setUnwrapping(e.target.value as 'none' | 'x' | 'y' | 'z')}
              displayEmpty
            >
              <MenuItem value="none">-</MenuItem>
              <MenuItem value="x">X</MenuItem>
              <MenuItem value="y">Y</MenuItem>
              <MenuItem value="z">Z</MenuItem>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
