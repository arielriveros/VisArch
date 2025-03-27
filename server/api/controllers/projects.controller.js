const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

async function index(req, res) {
  try {
    const projects = await Project.find();
    if (!projects) {
      res.status(404).json({msg: 'Projects not found'});
      return;
    }

    for (const project of projects) {
      const owner = await User.findById(project.owner);
      project.owner = owner;
    }

    res.status(200).json(projects);
  
  } catch (error) {
    res.status(500).json({msg: error});
  }
}

async function get(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({msg: 'Project not found'});
    }
    const owner = await User.findById(project.owner);
    if (!owner) {
      return res.status(404).json({msg: 'Owner not found'});
    }
    project.owner = owner;
    const collaborators = [];
    for (const collaboratorId of project.collaborators) {
      const collaborator = await User.findById(collaboratorId);
      if (!collaborator) {
        return res.status(404).json({msg: 'Collaborator not found'});
      }
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

    if (!name) 
      throw new Error('name-required');
    
    if (!owner)
      throw new Error('owner-required');

    if (!owner.match(/^[0-9a-fA-F]{24}$/)) 
      throw new Error('Invalid owner id');

    const _owner = await User.findById(owner);
    if (!_owner)
      throw new Error('owner-not-found');
    const project = new Project({
      name: name,
      description: description,
      owner: owner,
      collaborators: collaborators
    });
    const savedProject = await project.save();

    if (!savedProject)
      throw new Error('error-saving-project');

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({msg: 'Project not found'});
    }
    await Project.deleteOne({ _id: project._id });
    res.status(200).json({msg: 'Project deleted'});
  }
  catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

async function update(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({msg: 'Project not found'});
    }
    const { name, description, owner, collaborators } = req.body;
    if (name) project.name = name;
    if (description) project.description = description;
    if (owner) project.owner = owner;
    if (collaborators) project.collaborators = collaborators;
    await project.save();
    res.status(200).json(project);
  }
  catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

async function getTasks(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({msg: 'Project not found'});
    }
    const tasks = [];
    for (const t of project.tasks) {
      const task = await Task.findById(t._id);
      if (!task) {
        return res.status(404).json({msg: `Task ${task} not found`});
      }
      tasks.push(task);
    }
    res.status(200).json(tasks);
  }
  catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ msg: error.message });
  }
}

async function createTask(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({msg: 'Project not found'});

    const task = await Task.create({
      name: req.body.name,
      description: req.body.description,
      mesh: req.files.mesh[0].filename,
      thumbnail: req.files.thumbnail[0].filename,
    });
    project.tasks.push(task);
    await project.save();
    res.status(201).json(task);
  }
  catch (error) {
    console.error('Error in postTask:', error);
    // Remove uploaded files if error occurs
    if (req.files.mesh && req.files.mesh[0].path) {
      try {
        fs.unlinkSync(req.files.mesh[0].path);
        console.log('File deleted successfully.');
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    if (req.files.thumbnail && req.files.thumbnail[0].path) {
      try {
        fs.unlinkSync(req.files.thumbnail[0].path);
        console.log('File deleted successfully.');
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ msg: error.message });
  }
}

module.exports = {
  index,
  get,
  create,
  update,
  remove,
  getTasks,
  createTask
}