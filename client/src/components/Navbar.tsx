import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import useSession from '@/hooks/useSession';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signedIn } = useSession();
  const { t } = useTranslation();

  return (
    <AppBar position='sticky' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography
          variant='h5'
          className='title'
          component='div'
          sx={{ flexGrow: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          VisArch
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {signedIn ? (
            <>
              <Button
                color='inherit'
                component={RouterLink}
                to='/'
                disabled={location.pathname === '/'}
              >
                {t('navbar.home')}
              </Button>
              <Button
                color='inherit'
                component={RouterLink}
                to='/projects'
                disabled={location.pathname === '/projects'}
              >
                {t('navbar.projects')}
              </Button>
              <Button
                color='inherit'
                component={RouterLink}
                to='/user'
                disabled={location.pathname === '/user'}
              >
                {t('navbar.profile')}
              </Button>
            </>
          ) : (
            <Button
              color='inherit'
              component={RouterLink}
              to='/login'
              disabled={location.pathname === '/login'}
            >
              {t('navbar.login')}
            </Button>
          )}
          <LanguageSelector />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
