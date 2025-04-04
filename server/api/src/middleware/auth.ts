import { Request, Response, NextFunction } from 'express';

const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user) {
      next();
    } else {
      throw new Error('You must be logged in.');
    }
  } catch (err) {
    res.status(401).json({ msg: 'You must be logged in.' });
  }
};

export default requireAuth;
