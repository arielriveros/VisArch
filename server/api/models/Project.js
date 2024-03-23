const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User' 
  }],
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }]
});

ProjectSchema.pre('deleteOne', async function(next) {
  const project = await this.model.findOne(this.getQuery());
  if(!project)
    return next();
  // Delete all tasks in the project
  await mongoose.model('Task').deleteMany({ _id: { $in: project.tasks } });
  
  next();
});


module.exports = mongoose.model('Project', ProjectSchema);