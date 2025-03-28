import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ThemeProvider, CssBaseline, createTheme, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004e89'
    },
    secondary: {
      main: '#fca311'
    },
    warning: {
      main: '#c9184a'
    },
    background: {
      paper: '#f5f5f5',
      default: '#eff7f6'
    }
  },
});

export default function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <Box sx={{ width: '100vw', display: 'flex', height: '100%', flexDirection: 'column' }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
