import express, { Router } from 'express';
import TaskController from '../controllers/tasks.controller';
import validateID from '../middleware/validateID';

const router: Router = express.Router();

router.get('/:id', validateID, TaskController.get);
router.delete('/:id', validateID, TaskController.remove);
router.put('/:id', validateID, TaskController.update);

export default router;