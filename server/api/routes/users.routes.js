const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controller');
const validateID = require('../middleware/validateID');

router.get('/', UserController.index);
router.get('/:id', validateID, UserController.get);
router.get('/:id/projects', validateID, UserController.getProjects);
router.delete('/:id', validateID, UserController.remove);

module.exports = router; 