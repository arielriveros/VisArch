const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const requireAuth = require('../middleware/auth');
const uploadModel = require('../middleware/upload');

// All routes in this file require authentication
router.use(requireAuth);

router.get('/:id', TaskController.getById);
router.get('/:id/annotations', TaskController.getAnnotations);
router.post('/', uploadModel.fields(
    [{ name: 'model', maxCount: 1 }]
), TaskController.create);
router.delete('/:id', TaskController.remove);

module.exports = router;