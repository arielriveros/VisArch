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
  mesh: {
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

  fs.unlinkSync(`files/${task.mesh}`);
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

TaskSchema.pre('deleteMany', async function(next) {
  const tasks = await this.model.find(this.getQuery());
  if(!tasks)
    return next();

  tasks.forEach(task => {
    fs.unlinkSync(`files/${task.mesh}`);
    fs.unlinkSync(`files/${task.thumbnail}`);
  });

  return next();
});

module.exports = mongoose.model('Task', TaskSchema);