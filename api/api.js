const express = require('express');
const cors = require('cors');
const requireAuth = require('./middleware/auth');
const UserRoutes = require('./routes/UserRoutes');
const ProjectRoutes = require('./routes/ProjectRoutes');
const TaskRoutes = require('./routes/TaskRoutes');

// Entry point for the application
const api = express();  
api.use(express.json({limit : '50mb', extended : true}));
api.use(cors());
// Apply authentication middleware for the 'public' folder
api.use('/statics', requireAuth, express.static('public'));

// Routes
api.use('/api/user', UserRoutes);
api.use('/api/projects', ProjectRoutes);
api.use('/api/tasks', TaskRoutes);

module.exports = api;