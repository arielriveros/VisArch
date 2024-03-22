import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSession from '@/hooks/useSession';
import useConfig from '../hooks/useConfig';
import Emitter from '../utils/emitter';
import DragIcon from '@/assets/icons/drag.png';
import RotateIcon from '@/assets/icons/rotate.png';
import ZoomIcon from '@/assets/icons/zoom.png';
import LassoIcon from '@/assets/icons/lasso.png';
import '../styles/Toolbar.css';

export default function Toolbar() {
  const { signedIn } = useSession();
  const { tool, setTool, unwrapping, setUnwrapping } = useConfig();

  useEffect(() => {
    if (unwrapping !== 'none')
      Emitter.emit('RESET');
  }, [unwrapping]);

  return (
    <div className='toolbar-container'>
      <div className='toolbar-config'>
        <div className='toolbar-config-group'>
          <button className='toolbar-button' onClick={() => Emitter.emit('SAVE')} title='Save'>
            Save
          </button>
        </div>
      </div>
      <div className='toolbar-config'>
        <div className='toolbar-config-group'>
          <p className='group-label'>Controls</p>
          <button
            className={`toolbar-button ${tool === 'drag' ? 'active' : ''}`}
            onClick={() => setTool('drag')}
            title='Drag'
          >
            <img className='toolbar-icon' src={DragIcon} alt='Drag' />
          </button>
          <button
            className={`toolbar-button ${tool === 'rotate' ? 'active' : ''}`}
            onClick={() => setTool('rotate')}
            title='Rotate'
          >
            <img className='toolbar-icon' src={RotateIcon} alt='Rotate' />
          </button>
          <button
            className={`toolbar-button ${tool === 'zoom' ? 'active' : ''}`}
            onClick={() => setTool('zoom')}
            title='Zoom'
          >
            <img className='toolbar-icon' src={ZoomIcon} alt='Zoom' />
          </button>
          <button
            className={'toolbar-button'}
            onClick={() => Emitter.emit('RESET')}
            title='Reset'
          >
          Reset
          </button>
        </div>
        <div className='toolbar-config-group'>
          <p className='group-label'>Selection Tools</p>
          <button
            className={`toolbar-button ${tool === 'lasso' ? 'active' : ''}`}
            onClick={() => setTool('lasso')}
            title='Lasso'
          >
            <img className='toolbar-icon' src={LassoIcon} alt='Lasso' />
          </button>
        </div>
        <div className='toolbar-config-group'>
          <p className='group-label'>Unwrapping</p>
          <select className='toolbar-select' onChange={(e) => setUnwrapping(e.target.value as 'none' | 'x' | 'y' | 'z')} value={unwrapping}>
            <option value='none'>None</option>
            <option value='x'>X</option>
            <option value='y'>Y</option>
            <option value='z'>Z</option>
          </select>
        </div>
      </div>
      <nav className='toolbar-navbar'>
        {signedIn ?
          <>
            <Link className='toolbar-navbar-link' to='/'>
              Home
            </Link>
            <Link className='toolbar-navbar-link' to='/projects'>
              Projects
            </Link>
            <Link className='toolbar-navbar-link' to='/user'>
              Profile
            </Link>
          </> 
          :
          <>
            <Link className='toolbar-navbar-link' to='/login'>
              Login
            </Link>
          </>
        }
      </nav>
    </div>
  );
}
