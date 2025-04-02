import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import useSession from '@/hooks/useSession';
import LanguageSelector from './LanguageSelector';
import useFetch from '@/hooks/useFetch';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signedIn, logout, user } = useSession();
  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const { execute } = useFetch({
    url: `api/users/${user?.id}`,
    options: {
      method: 'DELETE'
    },
    immediate: false,
    onSuccess: () => {
      logout();
    },
  });

  useEffect(() => {
    const browserLanguage = navigator.language || 'en-US';
    const supportedLanguages = ['en', 'es'];
    const isSupported = supportedLanguages.includes(browserLanguage.split('-')[0]);
    // TODO: Add language to user local settings
    i18n.changeLanguage(isSupported ? browserLanguage.split('-')[0] : 'en');
  }, [i18n]);

  return (
    <AppBar position='static' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
              <IconButton color='inherit' onClick={handleMenuOpen}>
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                {user && (
                  <Box p={2} display='flex' flexDirection='column' alignItems='center'>
                    {user.picture && (
                      <Avatar src={user.picture} alt='profile' sx={{ width: 60, height: 60, mb: 1 }} />
                    )}
                    <Typography variant='h6'>{user.displayName}</Typography>
                    <Typography variant='body2'>{user.email}</Typography>
                  </Box>
                )}
                <Box display="flex" flexDirection="column" alignItems="center" p={1} width="100%">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => logout()}
                    sx={{ mb: 1 }}
                    fullWidth
                  >
                    {t('profile.logout')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleOpenDialog}
                    fullWidth
                  >
                    {t('profile.delete-profile')}
                  </Button>
                </Box>
              </Menu>
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

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{t('profile.confirm-delete-title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('profile.confirm-delete-message')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            {t('profile.cancel')}
          </Button>
          <Button
            onClick={() => {
              execute();
              handleCloseDialog();
            }}
            color='error'
          >
            {t('profile.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
