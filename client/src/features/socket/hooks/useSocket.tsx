import React, { useContext, useEffect, useRef, useState } from 'react'
import { SocketContext } from '../contexts/SocketContext';
import { Socket, io, } from 'socket.io-client';
import { config } from '../../../utils/config';

export function useSocket() {
	const socket = useRef<Socket<any>>(
		io(config.SOCKET_URL, { transports: ['websocket'], autoConnect: false })
	);
	const context = useContext(SocketContext);

	useEffect(() => {
		// Connect to the server when the component mounts
		socket.current.connect();
	
		// Set up event listeners
		socket.current.on('connect', () => {
		  console.log('Connected to server');
		  context.dispatch({ type: 'SET_CONNECTED', payload: true });
		});
	
		socket.current.on('disconnect', () => {
		  console.log('Disconnected from server');
		  context.dispatch({ type: 'SET_CONNECTED', payload: false });
		});
	
		// Clean up event listeners when the component unmounts
		return () => {
		  socket.current.disconnect();
		  socket.current.off('connect');
		  socket.current.off('disconnect');
		};
	  }, []);


	async function emit(event: string, data: any) {
		if (!socket.current) return;
		socket.current.emit(event, data);
	}

	return { emit }
}
