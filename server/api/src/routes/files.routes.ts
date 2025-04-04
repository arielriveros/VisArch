import express from 'express';
import FileController from '../controllers/files.controller';

const router = express.Router();

router.get('/meshes/:id', FileController.getMesh);
router.get('/images/:id', FileController.getImage);
router.get('/tasks/:id', FileController.getTask);

export default router;