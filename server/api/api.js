const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const LoginRoutes = require('./routes/login.routes');
const UserRoutes = require('./routes/users.routes');
const ProjectRoutes = require('./routes/projects.routes');
const TaskRoutes = require('./routes/tasks.routes');
const FileRoutes = require('./routes/files.routes');
const GooglePassport = require('./auth/passport.google');
const GithubPassport = require('./auth/passport.github');
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

api.use(function(request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    }
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    }
  }
  next();
})

// Passport
api.use(GooglePassport.initialize());
api.use(GooglePassport.session());
api.use(GithubPassport.initialize());
api.use(GithubPassport.session());

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