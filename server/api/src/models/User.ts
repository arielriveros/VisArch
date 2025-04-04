import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  displayName: string;
  email?: string;
  providerId?: string;
  picture?: string;
}

const UserSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
  },
  providerId: {
    type: String,
    required: false,
  },
  picture: {
    type: String,
    required: false,
  },
});

UserSchema.pre('deleteOne', async function (next) {
  const conditions = this.getFilter();

  // Remove the user from all projects they are a collaborator of
  await mongoose.model('Project').updateMany(
    { collaborators: conditions._id },
    { $pull: { collaborators: conditions._id } }
  );

  // For projects the user was the owner of
  const projectsOwned = await mongoose.model('Project').find({ owner: conditions._id });

  if (projectsOwned.length === 0) {
    return next();
  }

  for (const project of projectsOwned) {
    // If there are collaborators, update the owner to the first collaborator
    if (project.collaborators.length !== 0) {
      await mongoose.model('Project').updateOne(
        { _id: project._id },
        {
          $set: {
            owner: project.collaborators[0],
            collaborators: project.collaborators.slice(1),
          },
        }
      );
    } else {
      // If no collaborators, delete the project
      await mongoose.model('Project').deleteOne({ _id: project._id });
    }
  }

  next();
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;