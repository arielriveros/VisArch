const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    class: {
        type: String,
        enum: ['object', 'terrain'],
        default: 'object'
    }
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;