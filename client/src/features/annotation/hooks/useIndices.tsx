import { useContext } from "react";
import { IndicesContext } from "../contexts/IndicesContext";

export function useIndicesContext() {
    const context = useContext(IndicesContext);

    if (!context)
        throw new Error('useProxyMeshContext must be used within a IndicesContextProvider');

    return context;
}