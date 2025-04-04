import { Request, Response, NextFunction } from 'express';

const validateID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      next();
    } else {
      throw new Error('Invalid ID');
    }
  } catch (err) {
    res.status(400).json({ msg: 'Invalid ID' });
  }
};

export default validateID;
