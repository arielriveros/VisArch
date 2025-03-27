import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ThemeProvider, CssBaseline, createTheme, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
  },
});

export default function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        className="bg-primary-color"
        sx={{
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
