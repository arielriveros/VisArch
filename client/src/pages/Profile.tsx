import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '@/api/config';
import useSession from '@/hooks/useSession';
import Resitricted from '@/components/Restricted';
import {
  Button,
  Typography,
  Box,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';

export default function Profile() {
  const { logout, user } = useSession();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (!user) return <Resitricted />;

  const handleDelete = async () => {
    const res = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
      credentials: 'include',
      method: 'DELETE',
    });
    if (res.ok) logout();
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgcolor="darkblue"
        p={4}
        borderRadius={2}
      >
        <Typography variant="h4" fontWeight="bold" mb={4}>
          {t('profile.title')}
        </Typography>
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Box width={120} height={120}>
            {user.picture && (
              <Avatar
                src={user.picture}
                alt="profile"
                sx={{ width: '100%', height: '100%' }}
              />
            )}
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" ml={4}>
            <Box display="flex" flexDirection="column" ml={4}>
              <Typography variant="h6" fontWeight="bold">
                {user.displayName}
              </Typography>
              <Typography>{user.email}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => logout()}
                sx={{ mb: 2 }}
              >
                {t('profile.logout')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleOpenDialog}
              >
                {t('profile.delete-profile')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{t('profile.confirm-delete-title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('profile.confirm-delete-message')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t('profile.cancel')}
          </Button>
          <Button
            onClick={() => {
              handleDelete();
              handleCloseDialog();
            }}
            color="error"
          >
            {t('profile.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
