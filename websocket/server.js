require('dotenv').config()
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT;

// Create the Express app
const app = express();

// Listen for connections
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
app.use(cors({ origin: CLIENT_URL }));

// Create the Socket.io server
const io = socketIO(server);

// Listen for new connections
io.on('connection', (socket) => {
    console.log(`Socket: New client ${socket.id} connected`);
    socket.on('disconnect', () => console.log('Socket: Client disconnected'));

    socket.on('JOIN', (room) => {
        socket.join(room);
        console.log(`Socket: Client ${socket.id} joined room ${room}`);
        socket.broadcast.to(room).emit('BROADCAST::JOIN');
    });

    socket.on('LEAVE', (room) => {
        socket.leave(room);
        console.log(`Socket: Client ${socket.id} left room ${room}`);
    });
    
    socket.on('EMIT::ADD_PATTERN_ARCHETYPE', (name, roomId) => {
        socket.broadcast.to(roomId).emit('BROADCAST::ADD_PATTERN_ARCHETYPE', name);
    });

    socket.on('EMIT::REMOVE_PATTERN_ARCHETYPE', (payload, roomId) => {
        socket.broadcast.to(roomId).emit('BROADCAST::REMOVE_PATTERN_ARCHETYPE', payload);
    });

    socket.on('EMIT::UPDATE_PATTERN_ARCHETYPE_LABEL', (payload, roomId) => {
        socket.broadcast.to(roomId).emit('BROADCAST::UPDATE_PATTERN_ARCHETYPE_LABEL', payload);
    });

    socket.on('EMIT::ADD_PATTERN_ENTITY', (payload, roomId) => {
        payload.client = false; // action is from server
        socket.broadcast.to(roomId).emit('BROADCAST::ADD_PATTERN_ENTITY', payload);
    });

    socket.on('EMIT::REMOVE_PATTERN_ENTITY', (payload, roomId) => {
        payload.client = false; // action is from server
        socket.broadcast.to(roomId).emit('BROADCAST::REMOVE_PATTERN_ENTITY', payload);
    });

    socket.on('EMIT::UPDATE_PATTERN_ENTITY_PROPERTIES', (payload, roomId) => {
        socket.broadcast.to(roomId).emit('BROADCAST::UPDATE_PATTERN_ENTITY_PROPERTIES', payload);
    });

    socket.on('EMIT::UPLOAD_TASK_ON_JOIN', (payload, roomId) => {
        console.log('EMIT::UPLOAD_TASK_ON_JOIN', payload);
    });

});
