import express, { Router } from 'express';
import ProjectController from '../controllers/projects.controller';
import validateID from '../middleware/validateID';
import uploadMesh from '../middleware/upload';

const router: Router = express.Router();

router.get('/', ProjectController.index);
router.get('/:id', validateID, ProjectController.get);
router.post('/', ProjectController.create);
router.put('/:id', validateID, ProjectController.update);
router.delete('/:id', validateID, ProjectController.remove);

router.get('/:id/tasks', validateID, ProjectController.getTasks);
router.post(
  '/:id/tasks',
  validateID, 
  uploadMesh.fields([{ name: 'mesh', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
  ProjectController.createTask);

export default router;