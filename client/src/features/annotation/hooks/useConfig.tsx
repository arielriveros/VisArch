import { useContext } from 'react';
import { ConfigContext } from '../contexts/ConfigContext';

export default function useConfig() {
  const context = useContext(ConfigContext);

  if (!context)
    throw new Error('useConfig must be used within a ConfigContextProvider');
  
  const setTool = (tool: 'drag' | 'rotate' | 'zoom' | 'lasso') => {
    const { dispatch } = context;
    dispatch({ type: 'SET_TOOL', payload: tool });
  };

  const setUnwrapping = (unwrapping: 'none' | 'x' | 'y' | 'z') => {
    const { dispatch } = context;
    dispatch({ type: 'SET_UNWRAPPING', payload: unwrapping });
  };

  return { tool: context.tool, unwrapping: context.unwrapping, setTool, setUnwrapping };
}
