import express, { Request, Response, NextFunction, Router } from 'express';
import cookieSession from 'cookie-session';
import LoginRoutes from './routes/login.routes';
import UserRoutes from './routes/users.routes';
import ProjectRoutes from './routes/projects.routes';
import TaskRoutes from './routes/tasks.routes';
import FileRoutes from './routes/files.routes';
import requireAuth from './middleware/auth';
import PassportConfig from './auth/passport.config';

// Create a router instead of an app
const router: Router = express.Router();
router.use(express.json({ limit: '50mb' }));

router.use(
  cookieSession({
    name: 'session',
    keys: [process.env.JWT_SECRET || 'default_secret'], // Provide a fallback for JWT_SECRET
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Fix for missing regenerate/save methods
router.use((req: Request & { session?: any }, res: Response, next: NextFunction) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb: (err?: Error) => void) => cb();
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb: (err?: Error) => void) => cb();
  }
  next();
});

// Passport
router.use(PassportConfig);

// API Routes
router.use('/auth', LoginRoutes); // Ensure login routes are correctly registered
router.use(requireAuth);
router.use('/users', UserRoutes);
router.use('/projects', ProjectRoutes);
router.use('/tasks', TaskRoutes);
router.use('/files', FileRoutes);

export default router;
