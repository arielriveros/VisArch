const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const FileController = require('../controllers/FileController');

// All routes in this file require authentication
router.use(requireAuth);

router.get('/:path/:id', FileController.getFile);

module.exports = router;