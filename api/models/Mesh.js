const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeshSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String
    },
});

const MeshModel = mongoose.model('Mesh', MeshSchema);

module.exports = MeshModel;