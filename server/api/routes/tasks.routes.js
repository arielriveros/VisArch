const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/tasks.controller');
const validateID = require('../middleware/validateID');

router.get('/:id', validateID, TaskController.get);
router.delete('/:id', validateID, TaskController.remove);
router.put('/:id', validateID, TaskController.update);

module.exports = router;