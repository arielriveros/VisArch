const ProjectModel = require('../models/Project');
const UserModel = require('../models/User');
const TaskModel = require('../models/Task');
const fs = require('fs');

async function index(req, res) {
    try {
        // Get user in request
        const { id: userId } = req.user || {};
        if (!userId)
            throw new Error('User not found');

        const user = await UserModel.findById(userId);
        // Populate projects with the owner containing _id and username fields
        const userProjects = await user.populate({
            path: 'projects',
            select: '-__v',
            populate: [
                { path: 'owner', select: '_id username' },
                { path: 'members', select: '_id username' }
              ]
        });
        // Return array of projects with the owner and members as user objects
        const projects = Array.isArray(userProjects?.projects) ? userProjects.projects.map(project => ({
            _id: project._id,
            ...project.toJSON(),
            tasks: project.tasks.map(task => ({
                _id: task._id})),
            owner: {
                _id: project.owner._id,
                username: project.owner.username
            },
            members: project.members.map(member => ({
                _id: member._id,
                username: member.username
            }))
        })) : [];

        return res.status(200).json({ projects });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message });
    }
}

async function create(req, res) {
    try {
        const owner = await UserModel.findOne({ username: req.body.owner });
        if (!owner)
            throw new Error('Owner not found');

        async function getMembers(members) {
            const memberUsers = [];
            for (let m of members) {
                const member = await UserModel.findOne({ username: m });
                if (!member)
                    throw new Error(`Member ${m} not found`);

                // check if member is already in the array and skip if true
                if (memberUsers.some(u => u.id === member.id))
                    continue;
                
                // check if member is the owner and skip if true
                else if (member.username === owner.username)
                    continue;

                else
                    memberUsers.push(member);
            }
            return memberUsers;
        }
        const memberUsers = await getMembers(req.body.members);
        // add owner to members array
        memberUsers.push(owner);

        const newProject = await ProjectModel.create({
            name: req.body.name,
            description: req.body.description,
            tasks: [],
            owner: owner,
            members: memberUsers,
            status: 'active'
        });

        // add project to members
        for (let m of memberUsers) {
            m.projects.push(newProject._id);
            await m.save();
        }

        return res.status(200).json(newProject);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err });
    }
}

async function deleteById(req, res) {
    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project)
            throw new Error('Project not found');

        const { id: userId } = req.user;
        if (project.owner.toString() !== userId)
            throw new Error('User is not the owner of the project');

        // remove project from members
        for (let m of project.members) {
            const member = await UserModel.findById(m);
            member.projects.pull(project._id);
            await member.save();
        }

        // remove tasks associated with project
        for (let t of project.tasks) {
            const task = await TaskModel.findById(t);
            task.members = [];
            await task.save();
            const out = await task.deleteOne();
            fs.unlinkSync(`public/${out.meshPath}`);
        }
        
        await project.deleteOne();

        return res.status(200).json({ message: 'Project deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err });
    }
}

async function updateById(req, res) {
    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project)
            throw new Error('Project not found');

        const { id: userId } = req.user;
        if (project.owner.toString() !== userId)
            throw new Error('User is not the owner of the project');

        const membersToDelete = req.body.membersToDelete;

        // remove project from members
        for (let m of membersToDelete) {
            const member = await UserModel.findById(m);
            member.projects.pull(project._id);
            await member.save();
        }

        const tasksToDelete = req.body.tasksToDelete;
        // remove tasks associated with project
        for (let t of tasksToDelete) {
            const task = await TaskModel.findById(t);
            if (!task)
                throw new Error('Task not found');
            let out = await task.deleteOne();
            fs.unlinkSync(`public/${out.meshPath}`);
        }

        project.name = req.body.name;
        project.description = req.body.description;
        project.owner = project.owner;
        project.members = project.members.filter(m => !membersToDelete.includes(m.toString()));
        project.tasks = project.tasks.filter(t => !tasksToDelete.includes(t.toString()));

        await project.save();

        return res.status(200).json(project);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err });
    }
}

async function getTasks(req, res) {
    try {
        // Get user in request and check if user is a member of the project
        const { id: userId } = req.user;
        const user = await UserModel.findById(userId);
        const project = await ProjectModel.findById(req.params.id);
        if (!project)
            throw new Error('Project not found');

        if (!project.members.some(m => m.toString() === user._id.toString()))
            throw new Error('User is not a member of the project');

        // Retrieve tasks based on their IDs
        const tasks = await TaskModel.find({ _id: { $in: project.tasks } });

        return res.status(200).json({ tasks });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message });
    }
}

module.exports = {
    index,
    create,
    deleteById,
    updateById,
    getTasks
}