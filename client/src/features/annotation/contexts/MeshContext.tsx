import { createContext, useReducer } from 'react';
import { BufferGeometry, Material, NormalBufferAttributes } from 'three';

interface MeshState {
  geometry: BufferGeometry<NormalBufferAttributes> | null;
  material: Material | null;
}
    
interface MeshAction {
  type: 'SET_GEOMETRY' | 'SET_MATERIAL';
  payload?: BufferGeometry<NormalBufferAttributes> | Material | null;
}

interface MeshContextProps extends MeshState {
  dispatch: React.Dispatch<MeshAction>;
}

export const MeshContext = createContext<MeshContextProps>(
  {
    geometry: null,
    material: null,
    dispatch: () => {}
  }
);

function MeshReducer(state: MeshState, action: MeshAction): MeshState {
  switch (action.type) {
  case 'SET_GEOMETRY':
    return { ...state, geometry: (Object.freeze(action.payload) as BufferGeometry<NormalBufferAttributes>) };
  case 'SET_MATERIAL':
    return { ...state, material: (Object.freeze(action.payload) as Material) };
  default:
    return state;
  }
}

export default function MeshContextProvider({ children }: { children: React.ReactNode}) {
  const [state, dispatch] = useReducer(MeshReducer, { geometry: null, material: null });
  return (
    <MeshContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MeshContext.Provider>
  );
}
