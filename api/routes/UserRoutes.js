const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const requireAuth = require('../middleware/auth');

// Login
router.post('/login', UserController.LoginUser);

// Register
router.post('/register', UserController.RegisterUser);

// Get users
// this requires authentication
router.get('/', requireAuth, UserController.GetUsers);


module.exports = router;