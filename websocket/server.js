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
    socket.on('update_annotations', (data) => {
        console.log('Received message', data);
        socket.broadcast.emit('updated_annotations', data);
    });
});
