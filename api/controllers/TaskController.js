const TaskModel = require('../models/Task');
const UserModel = require('../models/User');

async function getById(req, res){
    try{
        const { id: userId } = req.user || {};
        const user = await UserModel.findById(userId);
        if(!user)
            throw new Error('User not found');

        const task = await TaskModel.findById(req.params.id);
        if(!task)
            throw new Error('Task not found');

        if(!task.members.some(m => m.toString() === user._id.toString()))
            throw new Error('User is not a member of the task');

        return res.status(200).json(task);
    } catch(err){
        console.error(err);
        return res.status(500).json({msg: err.message});
    }
}

module.exports = {
    getById
}