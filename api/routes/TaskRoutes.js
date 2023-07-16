const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const requireAuth = require('../middleware/auth');

// All routes in this file require authentication
router.use(requireAuth);

router.get('/:id', TaskController.getById);

module.exports = router;