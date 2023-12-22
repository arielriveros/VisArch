import { useContext, useEffect, useRef } from 'react'
import { SocketContext } from '../contexts/SocketContext';

export function useSocket() {
	const socketContext = useContext(SocketContext);
	const socket = socketContext.socket;
	const roomId = socketContext.roomId;
	const dispatch = socketContext.dispatch;

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

		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
	
		// Clean up event listeners when the component unmounts
		return () => {
			socket.off('connect');
			socket.off('disconnect');
		};
	  }, []);


	function emit(event: string, data: any) {
		if (!socket) return;
		socket.emit(`EMIT::${event}`, data, roomId);
	}

	function disconnect() {
		if (!socket) return;
		socket.disconnect();
	}

	function join(roomId: string) {
		if (!socket) return;
		dispatch({ type: 'SET_ROOM_ID', payload: roomId });
		socket.emit('JOIN', roomId);
	}

	function leave() {
		if (!socket) return;
		socket.emit('LEAVE', roomId);
		dispatch({ type: 'SET_ROOM_ID', payload: null });
	}

	return { socket, emit, disconnect, join, leave, roomId };
}
