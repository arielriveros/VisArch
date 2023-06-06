// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

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

// Routes
app.get('/meshes', async (req, res) => {
    const meshes = await MeshModel.find({});
    res.json(meshes);
});

app.post('/meshes/add', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({
            status: 'error',
            error: 'Name must be provided',
        });
    }

    const newMesh = new MeshModel({
        name: req.body.name,
        url: `${req.body.name.replace(/\s+/g, '-')}-${Date.now()}`
    });

    // Check if mesh already exists
    const meshExists = await MeshModel.findOne({ name: req.body.name });
    if (meshExists) {
        return res.status(400).json({
            status: 'error',
            error: 'Mesh already exists',
        });
    }

    const savedMesh = await newMesh.save();
    res.json(savedMesh);
});

// delete mesh by name
app.delete('/meshes', async (req, res) => {
    const deletedMesh = await MeshModel.deleteOne({ name: req.params.name });
    res.json(deletedMesh);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});