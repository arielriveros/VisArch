// Dependencies 
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const { createServer } = require('http'); // Import HTTP server
const api = require('./api');

const app = express();
const server = createServer(app); // Create HTTP server

// CORS setup
app.use(cors({
  origin: process.env.APP_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// MongoDB connection
const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Use API routes
app.use('/api', api);

// Create WebSocket server
const io = new Server(server, {
  path: '/websocket',
  cors: { origin: process.env.APP_URL }
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

// Start the server
const PORT = process.env.NODE_ENV === 'production' ? 80 : 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});