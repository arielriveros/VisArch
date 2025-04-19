import { useTranslation } from 'react-i18next';
import { Typography, Box, Paper } from '@mui/material';
import GitHubLogo from '@/assets/images/github-mark.png';
import GoogleButton from 'react-google-button';

export default function LoginBox() {
  const { t } = useTranslation();

  const handleGoogleSSO = async () => {
    const apiUrl = '/api/auth/google';
    window.location.href = apiUrl;
  };

  const handleGithubSSO = async () => {
    const apiUrl = '/api/auth/github';
    window.location.href = apiUrl;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        fontWeight="bold"
        gutterBottom
      >
        {t('login.title')}
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} marginTop={2} bgcolor='primary'>
        <GoogleButton
          label={t('login.google')}
          onClick={handleGoogleSSO} />
        <button
          className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mt-4 border-slate-300 border'
          onClick={handleGithubSSO}
        >
          <img src={GitHubLogo} alt='github' className='w-6 h-6 inline-block mr-2' />
          {t('login.github')}
        </button>
      </Box>
    </Paper>
  );
}
