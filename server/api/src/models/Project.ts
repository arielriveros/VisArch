import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  tasks: mongoose.Types.ObjectId[];
}

const ProjectSchema = new Schema<IProject>({
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

ProjectSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
  const project = await this.model.findOne(this.getFilter());
  if (!project) return next();
  
  // Delete all tasks in the project
  await mongoose.model('Task').deleteMany({ _id: { $in: project.tasks } });
  
  next();
});

const Project: Model<IProject> = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;