const express = require('express');
const cors = require('cors');
const UserRoutes = require('./routes/UserRoutes');
const ProjectRoutes = require('./routes/ProjectRoutes');
const TaskRoutes = require('./routes/TaskRoutes');
const FileRoutes = require('./routes/FileRoutes');

// Entry point for the application
const api = express();  
api.use(express.json({limit : '50mb', extended : true}));
api.use(cors());

// Routes
api.use('/api/user', UserRoutes);
api.use('/api/projects', ProjectRoutes);
api.use('/api/tasks', TaskRoutes);
api.use('/api/files', FileRoutes);

module.exports = api;