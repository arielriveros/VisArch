import { createContext, useReducer } from 'react';
import { BufferGeometry, Material, NormalBufferAttributes } from 'three';

interface ModelState {
  geometry: BufferGeometry<NormalBufferAttributes> | null;
  material: Material | null;
}
    
interface ModelAction {
  type: 'SET_GEOMETRY' | 'SET_MATERIAL';
  payload?: BufferGeometry<NormalBufferAttributes> | Material | null;
}

interface ModelContextProps extends ModelState {
  dispatch: React.Dispatch<ModelAction>;
}

export const ModelContext = createContext<ModelContextProps>(
  {
    geometry: null,
    material: null,
    dispatch: () => {}
  }
);

function ModelReducer(state: ModelState, action: ModelAction): ModelState {
  switch (action.type) {
  case 'SET_GEOMETRY':
    return { ...state, geometry: (Object.freeze(action.payload) as BufferGeometry<NormalBufferAttributes>) };
  case 'SET_MATERIAL':
    return { ...state, material: (Object.freeze(action.payload) as Material) };
  default:
    return state;
  }
}

export default function ModelContextProvider({ children }: { children: React.ReactNode}) {
  const [state, dispatch] = useReducer(ModelReducer, { geometry: null, material: null });
  return (
    <ModelContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ModelContext.Provider>
  );
}
