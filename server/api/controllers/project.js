const Project = require('../models/Project');
const User = require('../models/User');

async function getFromUser(req, res) {
  try {
    const userId = req.params.userId;
    const projects = await Project.find({ $or: [{ owner: userId }, { collaborators: userId }] });

    for (const project of projects) {
      const owner = await User.findById(project.owner);
      project.owner = owner;
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

async function get(req, res) {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    const owner = await User.findById(project.owner);
    project.owner = owner;
    const collaborators = [];
    for (const collaboratorId of project.collaborators) {
      const collaborator = await User.findById(collaboratorId);
      collaborators.push(collaborator);
    }
    project.collaborators = collaborators;
    res.status(200).json(project);
  }
  catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

async function create(req, res) {
  try {
    const { name, description, owner, collaborators } = req.body;

    const project = new Project({
      name: name,
      description: description,
      owner: owner,
      collaborators: collaborators
    });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({msg: error});
  }
}

module.exports = {
  get,
  getFromUser,
  create
}