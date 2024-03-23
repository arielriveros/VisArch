const fs = require('fs');
const mongoose = require('mongoose');
const Project = require('./Project');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  model: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  annotations: [{
    type: Object
  }]
})

TaskSchema.pre('deleteOne', async function(next) {
  const task = await this.model.findOne(this.getQuery());
  if(!task)
      return next();

  fs.unlinkSync(`files/${task.model}`);
  fs.unlinkSync(`files/${task.thumbnail}`);

  // Find project this task belongs to
  const project = await Project.findOne({ tasks: task._id });
  if(!project)
      return next();

  // Remove task from project
  project.tasks.pull(task._id);
  await project.save();

  return next();
});

module.exports = mongoose.model('Task', TaskSchema);