const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    meshPath: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;