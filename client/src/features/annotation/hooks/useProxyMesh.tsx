import { useContext } from "react";
import { ProxyMeshContext } from "../contexts/ProxyMeshContext";

export function useProxyMeshContext() {
    const context = useContext(ProxyMeshContext);

    if (!context)
        throw new Error('useProxyMeshContext must be used within a ProxyMeshContextProvider');

    return context;
}