const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const LoginRoutes = require('./routes/login.routes');
const UserRoutes = require('./routes/users.routes');
const ProjectRoutes = require('./routes/projects.routes');
const TaskRoutes = require('./routes/tasks.routes');
const FileRoutes = require('./routes/files.routes');
const PassportConfig = require('./auth/passport.config');
const requireAuth = require('./middleware/auth');

// Create a router instead of an app
const router = express.Router();  
router.use(express.json({ limit: '50mb', extended: true }));

// CORS
router.use(cors({
  origin: process.env.APP_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

router.use(cookieSession({
  name: 'session',
  keys: [process.env.JWT_SECRET],
  maxAge: 24 * 60 * 60 * 1000
}));

// Fix for missing regenerate/save methods
router.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => cb();
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => cb();
  }
  next();
});

// Passport
router.use(PassportConfig.router);

// API Routes
router.use('/auth', LoginRoutes);  // Ensure login routes are correctly registered
router.use(requireAuth);
router.use('/users', UserRoutes);
router.use('/projects', ProjectRoutes);
router.use('/tasks', TaskRoutes);
router.use('/files', FileRoutes);

module.exports = router;
