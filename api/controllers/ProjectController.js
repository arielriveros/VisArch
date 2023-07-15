const ProjectModel = require('../models/Project');

async function index(req, res) {
    try {
        const projects = await ProjectModel.find({});
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