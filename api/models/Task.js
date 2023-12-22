const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    meshPath: {
        type: String
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    annotations: [{
        type: Schema.Types.ObjectId,
        ref: 'PatternArchetype'
    }]
});

TaskSchema.pre('deleteOne', async function(next) {
    const task = await this.model.findOne(this.getQuery());
    if(!task)
        return next();

    const annotations = await task.annotations;
    if(!annotations)
        return next();

    for(let annotation of annotations)
        await annotation.deleteOne();

    return next();
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;