import ReactDOM from 'react-dom/client';
import App from './app/App';
import { AuthContextProvider } from 'features/authentication/contexts/AuthContext';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  //</React.StrictMode>
);