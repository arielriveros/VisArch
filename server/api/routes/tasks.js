const express = require('express');
const router = express.Router();
const uploadModel = require('../middleware/upload');
const TaskController = require('../controllers/task');

router.get('/:taskId', TaskController.get);
router.get('/fromProject/:projectId', TaskController.getFromProject);
router.post('/',
  uploadModel.fields([{ name: 'model', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
  TaskController.create);
router.delete('/:taskId', TaskController.remove);
router.put('/:taskId', TaskController.update);

module.exports = router;