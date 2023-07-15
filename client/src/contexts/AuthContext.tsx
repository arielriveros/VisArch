import { createContext, useReducer } from 'react';

interface User {
  userName: string;
  email?: string;
}
  
interface AuthState {
  user: User | null;
}
  
interface AuthAction {
  type: string;
  payload?: User;
}

interface AuthContextProps extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  dispatch: () => {}
});

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload || null };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state
  }
}

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}