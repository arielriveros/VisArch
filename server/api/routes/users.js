const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

// Get all users
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.delete('/:id', UserController.deleteById);

module.exports = router; 