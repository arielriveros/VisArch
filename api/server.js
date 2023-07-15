// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MeshRoutes = require('./routes/MeshRoutes');
const UserRoutes = require('./routes/UserRoutes');
require('dotenv').config()

// Entry point for the application
const app = express();  
app.use(express.json());
app.use(cors());
app.use(express.static('public'));


const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => { console.log('MongoDB connected') })
.catch((err) => { console.log(err) });

// Routes

app.use('/api/meshes', MeshRoutes);
app.use('/api/user', UserRoutes);

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});