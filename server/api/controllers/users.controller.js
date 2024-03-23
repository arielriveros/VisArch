const User = require('../models/User');
const Project = require('../models/Project');

async function index(req, res) {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({msg: 'Users not found'});
      return;
    }

    res.status(200).json(users);
  
  } catch (error) {
    res.status(500).json({msg: error});
  }
}

async function get(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({msg: 'User not found'});
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({msg: error});
  }
}

async function remove(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.status(200).json({msg: 'User deleted'});
    } else {
      res.status(404).json({msg: 'User not found'});
    }
  } catch (error) {
    res.status(500).json({msg: error});
  }
}

async function getProjects(req, res) {
  try {
    const user = await User.findById(req.params.id);
    const projects = await Project.find({ $or: [{ owner: user._id }, { collaborators: user._id }] });

    for (const project of projects) {
      const owner = await User.findById(project.owner);
      project.owner = owner;
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

module.exports = {
  index,
  get,
  remove,
  getProjects
}