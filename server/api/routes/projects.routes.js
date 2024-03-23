const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projects.controller');
const validateID = require('../middleware/validateID');
const uploadModel = require('../middleware/upload');

router.get('/', ProjectController.index);
router.get('/:id', validateID, ProjectController.get);
router.post('/', ProjectController.create);
router.delete('/:id', validateID, ProjectController.remove);

router.get('/:id/tasks', validateID, ProjectController.getTasks);
router.post(
  '/:id/tasks',
  validateID, 
  uploadModel.fields([{ name: 'model', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
  ProjectController.createTask);

module.exports = router;