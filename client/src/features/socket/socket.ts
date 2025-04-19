import { io } from 'socket.io-client';


export const socket = io('', {
  path: '/websocket',
  autoConnect: false,
  reconnection: false,
  secure: process.env.NODE_ENV === 'production'
});