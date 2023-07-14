const MeshModel = require('../models/Mesh');
const fs = require('fs');

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
        const newMesh = new MeshModel({
            name: req.body.name,
        });

        // Removes the public folder name in the relative path
        function filterPublicFolder(path) {
            let fixedPath = path.split('\\').slice(1).join('\\');
            return fixedPath;
        }

        if(req.files.model)
            newMesh.modelPath = filterPublicFolder(req.files.model[0].path);
    
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
        const query = await MeshModel.findByIdAndDelete(req.params.id);
        fs.unlinkSync(`public/${query.modelPath}`);
        return res.status(200).json({ query });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

module.exports = {
    index,
    create,
    destroy
}