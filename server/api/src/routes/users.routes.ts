import express, { Router } from 'express';
import UserController from '../controllers/users.controller';
import validateID from '../middleware/validateID';

const router: Router = express.Router();

router.get('/', UserController.index);
router.get('/:id', validateID, UserController.get);
router.get('/:id/projects', validateID, UserController.getProjects);
router.delete('/:id', validateID, UserController.remove);

export default router;