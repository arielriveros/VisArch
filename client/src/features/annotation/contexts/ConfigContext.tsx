import { createContext, useReducer } from 'react';

interface ConfigState {
  tool: 'drag' | 'rotate' | 'zoom' | 'lasso';
  unwrapping: 'none' | 'x' | 'y' | 'z';
}

interface ToolsAction {
  type: 'SET_TOOL';
  payload?: 'drag' | 'rotate' | 'zoom' | 'lasso';
}

interface UnwrappingAction {
  type: 'SET_UNWRAPPING';
  payload?: 'none' | 'x' | 'y' | 'z';
}
    
type ConfigAction = ToolsAction | UnwrappingAction;

interface ConfigContextProps extends ConfigState {
  dispatch: React.Dispatch<ConfigAction>;
}


export const ConfigContext = createContext<ConfigContextProps>(
  {
    tool: 'drag',
    unwrapping: 'none',
    dispatch: () => {}
  }
);

function ConfigReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
  case 'SET_TOOL':
    return { ...state, tool: action.payload || 'drag' };
  case 'SET_UNWRAPPING':
    return { ...state, unwrapping: action.payload || 'none' };
  default:
    return state;
  }
}

export default function ConfigContextProvider({ children }: { children: React.ReactNode}) {
  const [state, dispatch] = useReducer(ConfigReducer, { tool: 'drag', unwrapping: 'none' });
  return (
    <ConfigContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ConfigContext.Provider>
  );
}
