const ProjectModel = require('../models/Project');
const UserModel = require('../models/User');

async function index(req, res) {
    try {
        // Get id from user in request
        const { id: userId } = req.user;
        // Get projects from user
        const userProjects = await UserModel.findById(userId).populate('projects');
        // Return array of projects
        const projects = Array.isArray(userProjects?.projects) ? userProjects.projects : [userProjects?.projects];
        return res.status(200).json({ projects });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err });
    }
}

async function getById(req, res) {
    try {
        const project = await ProjectModel.findById(req.params.id);
        return res.status(200).json({ project });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err });
    }
}

async function create(req, res) {
    try {
        const project = await ProjectModel.create(req.body);
        return res.status(200).json({ project });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err });
    }
}

module.exports = {
    index,
    getById,
    create
}