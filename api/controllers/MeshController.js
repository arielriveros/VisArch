const MeshModel = require('../models/Mesh');

const index = async (req, res) => {
    try {
        const meshes = await MeshModel.find({});
        return res.status(200).json({ meshes });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err });
    }
}

const create = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                error: 'File must be provided',
            });
        }
    
        const newMesh = new MeshModel({
            name: req.body.name,
            vertexData: {
                data: fs.readFileSync(`public/meshFiles/${req.file.filename}`),
                contentType: 'text/plain'
            },
            textureData: {
                data: fs.readFileSync(`public/meshFiles/${req.file.filename}`),
                contentType: 'image/png'
            },
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
        
        return res.status(200).json({ savedMesh });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const destroy = async (req, res) => {
    try {
        const mesh = await MeshModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ mesh });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

module.exports = {
    index,
    create,
    destroy
}