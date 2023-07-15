const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Login
router.post('/login', UserController.LoginUser);

// Register
router.post('/register', UserController.RegisterUser);


module.exports = router;