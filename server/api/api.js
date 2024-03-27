const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const LoginRoutes = require('./routes/login.routes');
const UserRoutes = require('./routes/users.routes');
const ProjectRoutes = require('./routes/projects.routes');
const TaskRoutes = require('./routes/tasks.routes');
const FileRoutes = require('./routes/files.routes');
const googlePassport = require('./auth/passportGoogle');
const githubPassport = require('./auth/passportGithub');
const requireAuth = require('./middleware/auth');

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

// API Routes
const apiRouter = express.Router();

// Set up routes
apiRouter.use('/auth', LoginRoutes);
apiRouter.use(requireAuth);
apiRouter.use('/users', UserRoutes);
apiRouter.use('/projects', ProjectRoutes);
apiRouter.use('/tasks', TaskRoutes);
apiRouter.use('/files', FileRoutes);

// Mount the API router
api.use('/api', apiRouter);

module.exports = api;