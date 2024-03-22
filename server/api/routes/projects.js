const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project');

router.get('/fromUser/:userId', ProjectController.getFromUser);
router.get('/:projectId', ProjectController.get);
router.post('/', ProjectController.create);

module.exports = router;