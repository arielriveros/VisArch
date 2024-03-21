const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();  
app.use(cors());

// Start the server
const PORT = process.env.NODE_ENV === 'production' ? 80 : 5001;
const server = app.listen(PORT, () => {
    console.log(`Websocket server running on port ${PORT}`);
}); 

// Create a new socket.io server
const io = new Server(server, {
  path: '/websocket',
  cors: {
    origin: process.env.APP_URL
  }
});

// Listen for incoming connections
io.on('connection', (socket) => {
  console.log('A user connected');
  let socketRoom = null;

  socket.on('join', (room) => {
    console.log(`User joined room: ${room}`);
    socket.join(room);
    socketRoom = room;
    socket.broadcast.to(room).emit('userJoined', socket.id);
  });

  socket.on('leave', (room) => {
    console.log(`User left room: ${room}`);
    socket.leave(room);
    socketRoom = null;
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('addArchetype', (newArchetype) => {
    socket.broadcast.to(socketRoom).emit('addArchetype', newArchetype);
  });

  socket.on('removeArchetype', (archetypeId) => {
    socket.broadcast.to(socketRoom).emit('removeArchetype', archetypeId);
  });

  socket.on('updateArchetype', (archetypePayload) => {
    socket.broadcast.to(socketRoom).emit('updateArchetype', archetypePayload);
  });

  socket.on('addEntity', (entityPayload) => {
    socket.broadcast.to(socketRoom).emit('addEntity', entityPayload);
  });

  socket.on('removeEntity', (entityPayload) => {
    socket.broadcast.to(socketRoom).emit('removeEntity', entityPayload);
  });

  socket.on('updateEntity', (entityPayload) => {
    socket.broadcast.to(socketRoom).emit('updateEntity', entityPayload);
  });

});
