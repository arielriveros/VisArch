import { useContext, useEffect, useRef, useState } from 'react'
import { SocketContext } from '../contexts/SocketContext';

export function useSocket() {
	const socket = useContext(SocketContext);

	useEffect(() => {
		if (!socket) return;
		// Connect to the server when the component mounts
		socket.connect();
	
		// Set up event listeners
		socket.on('connect', () => {
		  console.log('Connected to server');
		});
	
		socket.on('disconnect', () => {
		  console.log('Disconnected from server');
		});
	
		// Clean up event listeners when the component unmounts
		return () => {
			if (!socket) return;
			socket.disconnect();
			socket.off('connect');
			socket.off('disconnect');
		};
	  }, []);


	async function emit(event: string, data: any) {
		if (!socket) return;
		socket.emit(`EMIT::${event}`, data);
	}

	return { socket, emit }
}
