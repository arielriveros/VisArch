import { createContext, useReducer, Dispatch, useEffect } from "react";
import { Socket, io } from 'socket.io-client';
import { SOCKET_ENDPOINT } from "../../../common/api/Endpoints";

interface SocketState {
    socket: Socket<any, any> | null;
    roomId: string | null;
}

interface SocketAction {
    type: 'SET_ROOM_ID';
    payload: string | null;
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

export const SocketContext = createContext<SocketContextProps>({ socket: null, roomId: null, dispatch: () => {} });

export function SocketContextProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(
                                SocketReducer, {
                                    socket: io(SOCKET_ENDPOINT(), {
                                        path: '/websocket',
                                        autoConnect: false,
                                        reconnection: false,
                                        transports: ['websocket'] }),
                                    roomId: null } );

    return (
        <SocketContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SocketContext.Provider>
    );
}