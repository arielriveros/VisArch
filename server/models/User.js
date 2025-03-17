const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String
  },
  providerId: {
    type: String,
    required: false
  },
  picture: {
    type: String,
    required: false
  },
});

UserSchema.pre('deleteOne', async function(next) {
  // Remove the user from all projects they are a collaborator of
  await mongoose.model('Project').updateMany(
  { collaborators: this._conditions._id },
  { $pull: { collaborators: this._conditions._id } }
  );

  // for projects the user was the owner of
  const projectsOwned = await mongoose.model('Project').find({ owner: this._conditions._id });

  if (projectsOwned.length === 0)
    next();

  for (const project of projectsOwned) {
    // If there are collaborators, update the owner to the first collaborator
    if (project.collaborators.length !== 0) {
      await mongoose.model('Project').updateOne(
      { _id: project._id },
      { $set: { 
          owner: project.collaborators[0],
          collaborators: project.collaborators.slice(1)
      }}
      );
    }
    // If no collaborators, delete the project
    else
      await mongoose.model('Project').deleteOne({ _id: project._id });
  }

  next();
});

module.exports = mongoose.model('User', UserSchema);