const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeshSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    vertexData: {
        type: Buffer,
        contentType: String
    },
    textureData: {
        type: Buffer,
        contentType: String
    }
});

const MeshModel = mongoose.model('Mesh', MeshSchema);

module.exports = MeshModel;