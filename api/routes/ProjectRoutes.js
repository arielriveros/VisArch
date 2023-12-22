const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');
const requireAuth = require('../middleware/auth');

// All routes in this file require authentication
router.use(requireAuth);

router.get('/', ProjectController.index);
router.post('/', ProjectController.create);
router.delete('/:id', ProjectController.deleteById);
router.put('/:id', ProjectController.updateById);

router.get('/:id/tasks', ProjectController.getTasks);

module.exports = router;