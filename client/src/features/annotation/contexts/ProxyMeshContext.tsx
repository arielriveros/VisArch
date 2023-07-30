import { createContext, useReducer } from "react";
import { BufferGeometry, NormalBufferAttributes } from "three";

export type ProxyMeshProperties = {
    readonly geometry?: BufferGeometry<NormalBufferAttributes>;
    readonly material: any;
}

interface ProxyMeshState {
    proxyMesh: ProxyMeshProperties | null;
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
        proxyMesh: null,
        dispatch: () => {}
    }
);

function proxyMeshReducer(state: ProxyMeshState, action: ProxyMeshAction): ProxyMeshState {
    switch (action.type) {
        case 'SET_PROXY_MESH':
            return { ...state, proxyMesh: action.payload || null };
        default:
            return state;
    }
}

export default function ProxyMeshContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(proxyMeshReducer, { proxyMesh: null });
    return (
        <ProxyMeshContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProxyMeshContext.Provider>
    )
}
