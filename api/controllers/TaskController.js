const TaskModel = require('../models/Task');
const UserModel = require('../models/User');
const ProjectModel = require('../models/Project');
const AnnotationModel = require('../models/Annotation');
const fs = require('fs');

async function getById(req, res){
    try{
        let task = req.task
        return res.status(200).json(task);
    } catch(err){
        console.error(err);
        return res.status(500).json({msg: err.message});
    }
}

async function create(req, res) {
    try{
        const { id: userId } = req.user || {};
        const user = await UserModel.findById(userId);
        if(!user)
            throw new Error('User not found');

        const project = await ProjectModel.findById(req.body.project);
        if(!project)
            throw new Error('Project not found');

        // Check if user is a member of the project
        if(!project.members.some(m => m.toString() === user._id.toString()))
            throw new Error('User is not a member of the project');
        
        // Removes the public folder name in the relative path
        function filterPublicFolder(path) {
            let fixedPath = path.split('\\').slice(1).join('\\');
            return fixedPath;
        }

        if(!req.files.model)
            throw new Error('No model file uploaded');

        // TODO: Rename if file already exists with the same file name (very unlikely)

        const newTask = await TaskModel.create({
            name: req.body.name,
            meshPath: filterPublicFolder(req.files.model[0].path),
            members: project.members,
            status: 'active',
            project: project,
            annotations: []
        });

        project.tasks.push(newTask._id);
        await project.save();

        return res.status(200).json(newTask);

    } catch(err){
        console.error(err);
        // Remove uploaded file if error occurs
        if(req.files.model)
            fs.unlinkSync(`${req.files.model[0].path}`);

        return res.status(500).json({msg: err.message});
    }
}

async function remove(req, res) {
    try {
        // Remove task from project
        req.project.tasks.pull(req.task._id);
        await req.project.save();

        // Remove task from database
        const out = await req.task.deleteOne();
        fs.unlinkSync(`public/${out.meshPath}`);

        return res.status(200).json({msg: 'Task deleted'});
    } catch(err){
        console.error(err);
        return res.status(500).json({msg: err.message});
    }
}

async function getAnnotations(req, res) {
    try{
        const annotations = await AnnotationModel.find({_id: { $in: req.task._id }});

        return res.status(200).json(annotations);

    } catch(err){
        console.error(err);
        return res.status(500).json({msg: err.message});
    }
}

async function updateTask(req, res) {
    try{
        const { task } = req;

        let updatedTask = {}

        updatedTask.name = req.body.name ?? task.name;
        updatedTask.status = req.body.status ?? task.status;
        
        // If no annotations are provided, keep the old ones
        if (!req.body.annotations)
            updatedTask.annotations = task.annotations;
        
/*         else {
            const updatedAnnotations = req.body.annotations;

            const annotations = await AnnotationModel.find({_id: { $in: req.task._id }});
    
            // If there are no annotations related to the task, create them
            if (annotations.length === 0) {
    
            }
        } */
        
        task.set(updatedTask);
        await task.save();
        return res.status(200).json(task);

    } catch(err){
        console.error(err);
        return res.status(500).json({msg: err.message});
    }
}


module.exports = {
    getById,
    create,
    remove,
    getAnnotations,
    updateTask
}