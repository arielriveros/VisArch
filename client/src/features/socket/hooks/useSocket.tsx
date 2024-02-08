import { useContext, useEffect } from 'react'
import { SocketContext } from '../contexts/SocketContext';

export function useSocket() {
	const { socket, roomId, dispatch } = useContext(SocketContext);

	useEffect(() => {
		if (!socket) return;

		// Set up event listeners
		socket.on('connect', () => {
			console.log('Connected to server');
		});
	
		socket.on('disconnect', () => {
			console.log('Disconnected from server');
		});

		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
	
		// Clean up event listeners when the component unmounts
		return () => {
			socket.off('connect');
			socket.off('disconnect');
		};
	}, [socket]);

	function connect() {
		socket?.connect();
	}

	function emit(event: string, data: any) {
		socket?.emit(`EMIT::${event}`, data, roomId);
	}

	function disconnect() {
		socket?.disconnect();
	}

	function join(roomId: string) {
		if (!socket) return;
		dispatch({ type: 'SET_ROOM_ID', payload: roomId });
		socket.emit('JOIN', roomId);
	}

	function leave(roomId: string) {
		if (!socket) return;
		socket.emit('LEAVE', roomId);
		dispatch({ type: 'SET_ROOM_ID', payload: null });
	}

	return { socket, emit, connect, disconnect, join, leave, roomId };
}
