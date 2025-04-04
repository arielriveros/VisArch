import express, { Request, Response, NextFunction, Router } from 'express';
import passport from 'passport';
import requireAuth from '../middleware/auth';

const router: Router = express.Router();

const successRedirect = process.env.NODE_ENV === 'production' 
  ? `https://${process.env.APP_URL}` 
  : 'http://localhost:3000';

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/callback/google',
  passport.authenticate('google'),
  (req: Request, res: Response) => {
    res.redirect(successRedirect);
  }
);

// Github
router.get('/github', passport.authenticate('github'));
router.get('/callback/github',
  passport.authenticate('github'),
  (req: Request, res: Response) => {
    res.redirect(successRedirect);
  }
);

// Login
router.get('/login', requireAuth, (req: Request, res: Response) => {
  res.status(200).json(req.user);
});

// Logout
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.NODE_ENV === 'production' ? successRedirect : '/');
  });
});

export default router;