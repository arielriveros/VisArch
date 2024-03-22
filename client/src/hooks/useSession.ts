import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/api/config';
import { UserApiResponse } from '@/api/types';
import { AuthContext } from '@/contexts/AuthContext';

export default function useSession() {
  const { user, signedIn, dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = useCallback(() => {
    setLoading(true);

    fetch(API_BASE_URL + '/api/auth/login', { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed to login');
        }
      })
      .then((data: UserApiResponse) => {
        if (data) {
          const user = {
            id: data._id,
            name: data.name,
            email: data.email,
            picture: data.picture
          };
          dispatch({ type: 'LOGIN', payload: user });
        }
      })
      .catch(err => {
        console.error(err);
        dispatch({ type: 'LOGOUT' });
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  const logout = () => {
    fetch(API_BASE_URL + '/api/auth/logout', { credentials: 'include', method: 'POST'})
      .then(() => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  return { user, loading, signedIn, login, logout };
}
