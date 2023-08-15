const TaskModel = require('../models/Task');
const UserModel = require('../models/User');
const ProjectModel = require('../models/Project');

const requireTaskPermission = async (req, res, next) => {
    try {
        const { id: userId } = req.user || {};
        const user = await UserModel.findById(userId);
        if(!user)
            throw new Error('User not found');
    
        const task = await TaskModel.findById(req.params.id);
        if(!task)
            throw new Error('Task not found');
    
        const project = await ProjectModel.findById(task.project);
        if(!project)
            throw new Error('Task does not belong to a project');
    
        if(!project.members.some(m => m.toString() === user._id.toString()))
            throw new Error('User is not a member of the project');

        req.task = task;
        req.project = project;
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Error" });
    }
}

module.exports = requireTaskPermission;