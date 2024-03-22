const express = require('express');
const cors = require('cors');
const LoginRoutes = require('./routes/login');
const UserRoutes = require('./routes/users');
const ProjectRoutes = require('./routes/projects');
const TaskRoutes = require('./routes/tasks');
const FileRoutes = require('./routes/files');
const requireAuth = require('./middleware/auth');
const googlePassport = require('./auth/passportGoogle');
const githubPassport = require('./auth/passportGithub');
const cookieSession = require('cookie-session');

// Entry point for the application
const api = express();  
api.use(express.json({limit : '50mb', extended : true}));

// Cors
api.use(cors({
  origin: process.env.APP_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

api.use(cookieSession({
  name: 'session',
  keys: [process.env.JWT_SECRET],
  maxAge: 24 * 60 * 60 * 1000
}));

// Passport
api.use(googlePassport.initialize());
api.use(googlePassport.session());
api.use(githubPassport.initialize());
api.use(githubPassport.session());

// Routes
api.use('/api/auth', LoginRoutes);
api.use('/api/users', requireAuth, UserRoutes);
api.use('/api/projects', requireAuth, ProjectRoutes);
api.use('/api/tasks', requireAuth, TaskRoutes);
api.use('/api/files', requireAuth, FileRoutes);
 
module.exports = api;