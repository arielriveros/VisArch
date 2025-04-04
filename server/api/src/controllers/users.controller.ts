import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

async function index(req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({ msg: 'Users not found' });
      return;
    }

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
}

async function get(req: Request, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.status(200).json({ msg: 'User deleted' });
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
}

async function getProjects(req: Request, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    // Populate owner details directly in the query
    const projects = await Project.find({ $or: [{ owner: user._id }, { collaborators: user._id }] })
      .populate('owner', 'displayName email');

    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
}

export default {
  index,
  get,
  remove,
  getProjects,
};