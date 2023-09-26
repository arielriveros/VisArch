import { createContext, useReducer } from "react";

interface SocketState {
    connected: boolean;
}
    
interface SocketAction {
    type: 
		'SET_CONNECTED';
    payload?: boolean | null;
}

interface SocketContextProps extends SocketState {
    dispatch: React.Dispatch<SocketAction>;
}

export const SocketContext = createContext<SocketContextProps>(
    {
		connected: false,
        dispatch: () => {}
    }
);

function SocketReducer(state: SocketState, action: SocketAction): SocketState {
    switch (action.type) {
        case 'SET_CONNECTED':
			return { ...state, connected: action.payload as boolean };
        default:
            return state;
    }
}

export default function SocketContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(SocketReducer, { connected: false });
    return (
        <SocketContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SocketContext.Provider>
    )
}
