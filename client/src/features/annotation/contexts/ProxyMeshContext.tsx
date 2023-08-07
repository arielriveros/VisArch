import { createContext, useReducer } from "react";
import { BufferGeometry, Material, NormalBufferAttributes } from "three";

export type ProxyMeshProperties = {
    readonly geometry: BufferGeometry<NormalBufferAttributes>;
    readonly material: Material;
}

interface ProxyMeshState {
    proxyGeometry: BufferGeometry<NormalBufferAttributes> | null;
    proxyMaterial: Material | null
}
    
interface ProxyMeshAction {
    type: string;
    payload?: ProxyMeshProperties;
}

interface ProxyMeshContextProps extends ProxyMeshState {
    dispatch: React.Dispatch<ProxyMeshAction>;
}

export const ProxyMeshContext = createContext<ProxyMeshContextProps>(
    {
        proxyGeometry: null,
        proxyMaterial: null,
        dispatch: () => {}
    }
);

function proxyMeshReducer(state: ProxyMeshState, action: ProxyMeshAction): ProxyMeshState {
    switch (action.type) {
        case 'SET_PROXY_MESH':
            return { ...state, proxyGeometry: action.payload?.geometry || null, proxyMaterial: action.payload?.material || null };
        default:
            return state;
    }
}

export default function ProxyMeshContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(proxyMeshReducer, { proxyGeometry: null, proxyMaterial: null });
    return (
        <ProxyMeshContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProxyMeshContext.Provider>
    )
}
