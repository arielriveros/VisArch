const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

async function get(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ msg: 'Task not found' });

    const project = await Project.findOne({ tasks: task._id });
    
    const owner = await User.findById(project.owner);
    const collaborators = await User.find({ _id: { $in: project.collaborators } }).lean();

    res.status(200).json({...task.toObject(), owner, collaborators});
  }
  catch (error) {
    console.error('Error in getTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

async function remove(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ msg: 'Task not found' });

    await Task.deleteOne({ _id: req.params.id });
    res.status(200).json({ msg: 'Task deleted' });
  }
  catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

async function update(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ msg: 'Task not found' });

    task.name = req.body.name;
    task.description = req.body.description;
    task.annotations = req.body.annotations;
    await task.save();
    res.status(200).json(task);
  }
  catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

module.exports = {
  get,
  remove,
  update
}