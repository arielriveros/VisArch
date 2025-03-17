import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from '@/contexts/AuthContext';
import AppRoutes from './Routes';

const App = () => {  
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AppRoutes />
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;