import { createContext, Context, useReducer, Dispatch } from "react";
import { Socket, io } from 'socket.io-client';
import { config } from '../../../utils/config';

interface SocketState {
    socket: Socket<any, any> | null;
    roomId: string | null;
}

interface SocketAction {
    type: 'SET_ROOM_ID';
    payload: string;
}

interface SocketContextProps extends SocketState {
    dispatch: Dispatch<SocketAction>;
}

function SocketReducer(state: SocketState, action: SocketAction): SocketState {
    switch (action.type) {
        case 'SET_ROOM_ID':
            return {
                ...state,
                roomId: action.payload
            }
        default:
            return state;
    }
}

export const socket: Socket<any> = io(config.SOCKET_URL, {autoConnect: false, reconnection: false, transports: ['websocket']});
//export const SocketContext: Context<Socket<any, any> | null> = createContext<Socket<any, any> | null>(null);
export const SocketContext: Context<SocketContextProps> = createContext<SocketContextProps>({socket: null, roomId: null, dispatch: () => {}});

export default function SocketContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(SocketReducer, {socket: socket, roomId: null});

    return (
        <SocketContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SocketContext.Provider>
    )
}

