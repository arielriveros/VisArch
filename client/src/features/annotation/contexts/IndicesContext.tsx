import { createContext, useReducer } from "react";
import { Vector3 } from "three";

export type IntersectionPayload = {
	face: {a: number, b: number, c: number, normal: Vector3} | null,
	faceIndex: number | null
}

interface IndicesState {
    indexPosition: IntersectionPayload | null;
    selectedIndices: number[];
}
    
interface IndicesAction {
    type: 'SET_INDEX_POSITION' | 'SET_SELECTED_INDICES';
    payload?: IntersectionPayload | number[] | null;
}

interface IndicesContextProps extends IndicesState {
    dispatch: React.Dispatch<IndicesAction>;
}

export const IndicesContext = createContext<IndicesContextProps>(
    {
        indexPosition: null,
        selectedIndices: [],
        dispatch: () => {}
    }
);

function indicesReducer(state: IndicesState, action: IndicesAction): IndicesState {
    switch (action.type) {
        case 'SET_INDEX_POSITION':
            if (!action.payload)
                return { ...state, indexPosition: null };

            return { ...state, indexPosition: action.payload as IntersectionPayload };

        case 'SET_SELECTED_INDICES':
            return { ...state, selectedIndices: (action.payload as number[]) || [] };

        default:
            return state;
    }
}

export default function IndicesContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(indicesReducer, { indexPosition: null, selectedIndices: [] });
    return (
        <IndicesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </IndicesContext.Provider>
    )
}
