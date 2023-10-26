const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const CLIENT_URL = 'http://localhost:3000';
const PORT = 5001;

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
        console.log('EMIT::ADD_PATTERN_ARCHETYPE', name);
        socket.broadcast.emit('BROADCAST::ADD_PATTERN_ARCHETYPE', name);
    })

    socket.on('EMIT::ADD_PATTERN_ENTITY', (payload) => {
        socket.broadcast.emit('BROADCAST::ADD_PATTERN_ENTITY', payload);
    })

});
