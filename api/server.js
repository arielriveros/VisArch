// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

// Models
const MeshModel = require('./models/Mesh');

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

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/meshFiles');
    },
    // TODO: Add hash to filename
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Routes
const MeshRoutes = require('./routes/MeshRoutes');
app.use('/api/meshes', MeshRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});