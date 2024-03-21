const Task = require('../models/Task');
const Project = require('../models/Project');
const fs = require('fs');

async function get(req, res) {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).json(task);
  }
  catch (error) {
    console.error('Error in getTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

async function getFromProject(req, res) {
  try {
    const projectId = req.params.projectId;
    const tasks = [];
    const project = await Project.findById(projectId)
    for (const task of project.tasks) {
      tasks.push(await Task.findById(task._id));
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getTasksFromProject:', error);
    res.status(500).json({ msg: error.message });
  }
}

async function create(req, res) {
  try {
    const project = await Project.findById(req.body.project);

    const task = await Task.create({
      name: req.body.name,
      description: req.body.description,
      model: req.files.model[0].filename
    });
    project.tasks.push(task);
    await project.save();
    res.status(201).json(task);
  }
  catch (error) {
    console.error('Error in postTask:', error);
    // Remove uploaded file if error occurs
    if (req.files.model && req.files.model[0].path) {
      try {
        fs.unlinkSync(req.files.model[0].path);
        console.log('File deleted successfully.');
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).send('Error creating task');
  }
}

async function remove(req, res) {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    await Task.deleteOne({ _id: taskId });
    res.status(200).send('Task deleted');
  }
  catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

async function update(req, res) {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }
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
  getFromProject,
  create,
  remove,
  update
}