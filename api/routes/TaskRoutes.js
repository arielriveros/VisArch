const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const requireAuth = require('../middleware/auth');
const uploadModel = require('../middleware/upload');
const requireTaskPermission = require('../middleware/taskPermission');

// All routes in this file require authentication
router.use(requireAuth);

router.get('/:id', requireTaskPermission, TaskController.getById);
router.get('/:id/annotations', requireTaskPermission, TaskController.getAnnotations);
router.post('/', uploadModel.fields(
    [{ name: 'model', maxCount: 1 }]
), TaskController.create);
router.delete('/:id', requireTaskPermission, TaskController.remove);

module.exports = router;