// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MeshRoutes = require('./routes/MeshRoutes');
const UserRoutes = require('./routes/UserRoutes');

// Entry point for the application
const app = express();  
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/visarch-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => { console.log('MongoDB connected') })
.catch((err) => { console.log(err) });

// Routes

app.use('/api/meshes', MeshRoutes);
app.use('/api/user', UserRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});