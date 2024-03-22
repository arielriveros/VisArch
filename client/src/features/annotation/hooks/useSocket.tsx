import { useEffect, useState, useCallback } from 'react';
import { socket } from '../socket';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const connect = useCallback(() => {
    if (!isConnected) socket.connect();
  }, [isConnected]);

  const disconnect = useCallback(() => {
    if (isConnected) socket.disconnect();
  }, [isConnected]);

  const registerEvent = useCallback((event: string, callback) => {
    socket.on(event, callback);
  }, []);

  const unregisterEvent = useCallback((event: string, callback) => {
    socket.off(event, callback);
  }, []);

  const emit = useCallback((event: string, ...args) => {
    socket.emit(event, ...args);
  }, []);

  const join = useCallback((room: string) => {
    socket.emit('join', room);
  }, []);

  const leave = useCallback((room: string) => {
    socket.emit('leave', room);
  }, []);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { isConnected,
    connect, disconnect,
    registerEvent, unregisterEvent,
    emit, join, leave};
}
