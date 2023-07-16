const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeshSchema = new Schema({
    modelPath: {
        type: String,
    }
});

const MeshModel = mongoose.model('Mesh', MeshSchema);

module.exports = MeshModel;