import { createContext, Context } from "react";
import { Socket, io } from 'socket.io-client';
import { config } from '../../../utils/config';

export const socket: Socket<any> = io(config.SOCKET_URL, {autoConnect: false, reconnection: false, transports: ['websocket']});
export const SocketContext: Context<Socket<any, any> | null> = createContext<Socket<any, any> | null>(null);

export default function SocketContextProvider({ children }: { children: React.ReactNode}) {

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

