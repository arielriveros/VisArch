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
        const owner = await UserModel.findOne({ username: req.body.owner });
        if (!owner)
            throw new Error('Owner not found');

        async function getMembers(members) {
            const memberUsers = [];
            for (let m of members) {
                const member = await UserModel.findOne({ username: m });
                if (!member)
                    throw new Error('Member not found');

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

module.exports = {
    index,
    getById,
    create
}