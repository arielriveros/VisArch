import { useCallback } from 'react';
import { socket } from '../socket';
import useSession from '@/hooks/useSession';

export function useSocket() {
  const { user } = useSession();

  const connect = useCallback(() => {
    socket.connect();
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

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
    if (user) {
      socket.emit('setUser', user);
      socket.emit('join', room);
    }
  }, [user]);

  const leave = useCallback((room: string) => {
    socket.emit('leave', room);
  }, []);


  return { connect, disconnect,
    registerEvent, unregisterEvent,
    emit, join, leave};
}
