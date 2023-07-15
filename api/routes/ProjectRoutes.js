const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');
const requireAuth = require('../middleware/auth');

// All routes in this file require authentication
router.use(requireAuth);

router.get('/', ProjectController.index);
router.get('/:id', ProjectController.getById);
router.post('/', ProjectController.create);

module.exports = router;