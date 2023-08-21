import { createContext, useReducer } from "react";
import { BufferGeometry, Material, NormalBufferAttributes } from "three";

interface ProxyMeshState {
    proxyGeometry: BufferGeometry<NormalBufferAttributes> | null;
    proxyMaterial: Material | null;
    unwrappedGeometry: BufferGeometry<NormalBufferAttributes> | null;
}
    
interface ProxyMeshAction {
    type: 'SET_PROXY_GEOMETRY' | 'SET_PROXY_MATERIAL' | 'SET_UNWRAPPED_GEOMETRY';
    payload?: BufferGeometry<NormalBufferAttributes> | Material | null;
}

interface ProxyMeshContextProps extends ProxyMeshState {
    dispatch: React.Dispatch<ProxyMeshAction>;
}

export const ProxyMeshContext = createContext<ProxyMeshContextProps>(
    {
        proxyGeometry: null,
        proxyMaterial: null,
        unwrappedGeometry: null,
        dispatch: () => {}
    }
);

function proxyMeshReducer(state: ProxyMeshState, action: ProxyMeshAction): ProxyMeshState {
    switch (action.type) {
        case 'SET_PROXY_GEOMETRY':
            return { ...state, proxyGeometry: (action.payload as BufferGeometry<NormalBufferAttributes>) };
        case 'SET_PROXY_MATERIAL':
            return { ...state, proxyMaterial: (action.payload as Material) };
        case 'SET_UNWRAPPED_GEOMETRY':
            return { ...state, unwrappedGeometry: (action.payload as BufferGeometry<NormalBufferAttributes>) };
        default:
            return state;
    }
}

export default function ProxyMeshContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(proxyMeshReducer, { proxyGeometry: null, proxyMaterial: null, unwrappedGeometry: null });
    return (
        <ProxyMeshContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProxyMeshContext.Provider>
    )
}
