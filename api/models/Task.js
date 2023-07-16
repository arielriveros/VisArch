const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mesh: {
        type: Schema.Types.ObjectId,
        ref: 'Mesh'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;