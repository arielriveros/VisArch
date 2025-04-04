import { Request, Response } from 'express';
import { Document, ObjectId } from 'mongoose';
import fs from 'fs';
import ProjectModel, { IProject } from '../models/Project';
import UserModel, { IUser } from '../models/User';
import TaskModel, { ITask } from '../models/Task';

async function index(req: Request, res: Response): Promise<void> {
  try {
    const projects = await ProjectModel.find().populate('owner', 'displayName email'); // Populate owner field
    if (!projects) {
      res.status(404).json({ msg: 'Projects not found' });
      return;
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
}

async function get(req: Request, res: Response): Promise<void> {
  try {
    const project = await ProjectModel.findById(req.params.id).populate('owner', 'displayName email').populate('collaborators', 'displayName email');
    if (!project) {
      res.status(404).json({ msg: 'Project not found' });
      return;
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ msg: (error as Error).message });
  }
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, owner, collaborators } = req.body;

    if (!name) throw new Error('name-required');
    if (!owner) throw new Error('owner-required');
    if (!owner.match(/^[0-9a-fA-F]{24}$/)) throw new Error('Invalid owner id');

    const _owner: IUser | null = await UserModel.findById(owner);
    if (!_owner) throw new Error('owner-not-found');

    const project = new ProjectModel({
      name,
      description,
      owner,
      collaborators,
    });
    const savedProject = await project.save();

    if (!savedProject) throw new Error('error-saving-project');

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      res.status(404).json({ msg: 'Project not found' });
      return;
    }
    await ProjectModel.deleteOne({ _id: project._id });
    res.status(200).json({ msg: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ msg: (error as Error).message });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      res.status(404).json({ msg: 'Project not found' });
      return;
    }
    const { name, description, owner, collaborators } = req.body;
    if (name) project.name = name;
    else throw new Error('name-required');
    if (description) project.description = description;
    if (owner) project.owner = owner;
    if (collaborators) project.collaborators = collaborators;
    await project.save();
    res.status(200).json(project);
  }
  catch (error) {
    const msg = (error as Error).message;
    res.status(400).json({ message: msg });
    return;
  }
}

async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      res.status(404).json({ msg: 'Project not found' });
      return;
    }
    const tasks: ITask[] = [];
    for (const t of project.tasks) {
      const task: (ITask & Document) | null = await TaskModel.findById(t._id);
      if (!task) {
        res.status(404).json({ msg: `Task ${t._id} not found` });
        return;
      }
      tasks.push(task);
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ msg: (error as Error).message });
  }
}

async function createTask(req: Request & { files?: { mesh?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] } }, res: Response): Promise<void> {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      res.status(404).json({ msg: 'Project not found' });
      return;
    }

    const task = await TaskModel.create({
      name: req.body.name,
      description: req.body.description,
      mesh: req.files?.mesh?.[0]?.filename ?? '',
      thumbnail: req.files?.thumbnail?.[0]?.filename ?? '',
    }) as ITask & Document<ObjectId>;
    project.tasks.push(task as any);
    await project.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error in postTask:', error);
    // Remove uploaded files if error occurs
    if (req.files?.mesh?.[0]?.path) {
      try {
        fs.unlinkSync(req.files.mesh[0].path);
        console.log('File deleted successfully.');
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    if (req.files?.thumbnail?.[0]?.path) {
      try {
        fs.unlinkSync(req.files.thumbnail[0].path);
        console.log('File deleted successfully.');
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ msg: (error as Error).message });
  }
}

export default {
  index,
  get,
  create,
  update,
  remove,
  getTasks,
  createTask,
};
