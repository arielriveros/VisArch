import fs from 'fs';
import Project from './Project';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { AnnotationSchema, IAnnotation } from './Annotation';

export interface ITask extends Document {
  name: string;
  description?: string;
  mesh: string;
  thumbnail: string;
  annotations: IAnnotation[];
}

const TaskSchema = new Schema<ITask>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  mesh: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  annotations: [AnnotationSchema],
}, {
  timestamps: true,
  _id: true
});

TaskSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const task = await this.model.findOne(this.getFilter());
  if (!task) return next();

  fs.unlinkSync(`files/${task.mesh}`);
  fs.unlinkSync(`files/${task.thumbnail}`);

  // Find project this task belongs to
  const project = await Project.findOne({ tasks: task._id });
  if (!project) return next();

  // Remove task from project
  (project.tasks as any).pull(task._id);
  await project.save();

  return next();
});

TaskSchema.pre('deleteMany', { document: false, query: true }, async function (next) {
  const tasks = await this.model.find(this.getFilter());
  if (!tasks) return next();

  tasks.forEach((task) => {
    fs.unlinkSync(`files/${task.mesh}`);
    fs.unlinkSync(`files/${task.thumbnail}`);
  });

  return next();
});

const Task: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
export default Task;