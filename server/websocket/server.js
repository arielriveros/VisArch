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
  let socketRoom = null;
  let user = null;
  console.log('A user connected')

  socket.on('setUser', (incUser) => {
    if (user) return;
    console.log(`User connected: ${incUser.name}`);
    user = incUser;
  });

  socket.on('join', (room) => {
    console.log(`User ${user?.name} joined room: ${room}`);
    socket.join(room);
    socketRoom = room;
    socket.broadcast.to(room).emit('userJoined', user);
  });

  socket.on('leave', (room) => {
    console.log(`User ${user?.name} left room: ${room}`);
    socket.broadcast.to(room).emit('userLeft', user);
    socket.leave(room);
    socketRoom = null;
  });

  socket.on('disconnect', () => {
    console.log(`User ${user?.name} disconnected`);
  });

  function broadcastMessage(event, payload) {
    if (user && socketRoom) {
      socket.broadcast.to(socketRoom).emit(event, payload, user.id, Date.now());
    }
  }

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

});
