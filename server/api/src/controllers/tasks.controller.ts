import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';


async function get(req: Request, res: Response): Promise<void> {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ msg: 'Task not found' });
      return;
    }

    const project = await Project.findOne({ tasks: task._id });
    if (!project) {
      res.status(404).json({ msg: 'Project not found' });
      return;
    }

    const owner = await User.findById(project.owner);
    const collaborators = await User.find({ _id: { $in: project.collaborators } }).lean();

    res.status(200).json({ ...task.toObject(), owner, collaborators });
  } catch (error: any) {
    console.error('Error in getTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ msg: 'Task not found' });
      return;
    }

    await Task.deleteOne({ _id: req.params.id });
    res.status(200).json({ msg: 'Task deleted' });
  } catch (error: any) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ msg: 'Task not found' });
      return;
    }

    task.name = req.body.name;
    task.description = req.body.description;
    task.annotations = req.body.annotations;
    await task.save();
    res.status(200).json(task);
  } catch (error: any) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

export default {
  get,
  remove,
  update
};