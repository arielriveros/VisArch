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
    
    socket.on('EMIT::ADD_PATTERN_ARCHETYPE', (name) => {
        socket.broadcast.emit('BROADCAST::ADD_PATTERN_ARCHETYPE', name);
    });

    socket.on('EMIT::REMOVE_PATTERN_ARCHETYPE', (payload) => {
        socket.broadcast.emit('BROADCAST::REMOVE_PATTERN_ARCHETYPE', payload);
    });

    socket.on('EMIT::ADD_PATTERN_ENTITY', (payload) => {
        payload.client = false; // action is from server
        socket.broadcast.emit('BROADCAST::ADD_PATTERN_ENTITY', payload);
    });

    socket.on('EMIT::REMOVE_PATTERN_ENTITY', (payload) => {
        payload.client = false; // action is from server
        socket.broadcast.emit('BROADCAST::REMOVE_PATTERN_ENTITY', payload);
    });

    socket.on('EMIT::UPDATE_PATTERN_ENTITY_PROPERTIES', (payload) => {
        socket.broadcast.emit('BROADCAST::UPDATE_PATTERN_ENTITY_PROPERTIES', payload);
    });

});
