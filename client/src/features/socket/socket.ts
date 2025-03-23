import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';

export const socket = io(URL, {
  path: '/websocket',
  autoConnect: false,
  reconnection: false
});