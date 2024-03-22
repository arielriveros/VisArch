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
  // Delete all tasks in the project
  await mongoose.model('Task').deleteMany({ project: this._conditions._id });
  next();
});


module.exports = mongoose.model('Project', ProjectSchema);