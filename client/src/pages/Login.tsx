import LoginBox from '@/components/LoginBox';
import { Box } from '@mui/material';

export default function Login() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100vw"
    >
      <Box width="100%" maxWidth="400px">
        <LoginBox />
      </Box>
    </Box>
  );
}
