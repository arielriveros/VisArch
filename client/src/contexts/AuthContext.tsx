import { createContext, useReducer } from 'react';

export interface User {
  id: string;
  userName: string;
  displayName: string;
  email: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  signedIn: boolean;
}

interface AuthAction {
  type: string;
  payload?: User | null;
}

interface AuthContextProps extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  signedIn: false,
  dispatch: () => {}
});

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
  case 'LOGIN':
    return {
      ...state, 
      user: action.payload as User,
      signedIn: true
    };
  case 'LOGOUT':
    return {
      ...state,
      user: null,
      signedIn: false
    };
  default:
    return state;
  }
}

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, signedIn: false });
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}