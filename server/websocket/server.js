// Dependencies
const { Server } = require('socket.io');
const express = require('express');
const app = express();

// Start the server
const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create WebSocket server
const io = new Server(server, {
  path: '/websocket',
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.APP_URL : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// WebSocket handling
io.on('connection', (socket) => {
  let socketRoom = null;
  let user = null;
  console.log('A user connected');

  socket.on('setUser', (incUser) => {
    if (user) return;
    console.log(`User connected: ${incUser.displayName}`);
    user = incUser;
  });

  socket.on('join', (room) => {
    console.log(`User ${user?.displayName} joined room: ${room}`);
    socket.join(room);
    socketRoom = room;
    socket.broadcast.to(room).emit('userJoined', user);
  });

  socket.on('leave', (room) => {
    console.log(`User ${user?.displayName} left room: ${room}`);
    socket.broadcast.to(room).emit('userLeft', user);
    socket.leave(room);
    socketRoom = null;
  });

  socket.on('disconnect', () => {
    console.log(`User ${user?.displayName} disconnected`);
  });

  function broadcastMessage(event, payload) {
    if (user && socketRoom) {
      socket.broadcast.to(socketRoom).emit(event, payload, user.id, Date.now());
    }
  }

  socket.on('setAnnotations', (annotations) => {
    broadcastMessage('setAnnotations', annotations);
  });

  socket.on('addArchetype', (newArchetype) => {
    broadcastMessage('addArchetype', newArchetype);
  });

  socket.on('removeArchetype', (archetypeId) => {
    broadcastMessage('removeArchetype', archetypeId);
  });

  socket.on('updateArchetype', (archetypePayload) => {
    broadcastMessage('updateArchetype', archetypePayload);
  });

  socket.on('addEntity', (entityPayload) => {
    broadcastMessage('addEntity', entityPayload);
  });

  socket.on('removeEntity', (entityPayload) => {
    broadcastMessage('removeEntity', entityPayload);
  });

  socket.on('updateEntity', (entityPayload) => {
    broadcastMessage('updateEntity', entityPayload);
  });

  socket.on('setEntityAsArchetype', (entityAsArchetypePayload) => {
    broadcastMessage('setEntityAsArchetype', entityAsArchetypePayload);
  });

});