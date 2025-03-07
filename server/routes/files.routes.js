const express = require('express');
const router = express.Router();
const FileController = require('../controllers/files.controller');

router.get('/meshes/:id', FileController.getMesh);
router.get('/images/:id', FileController.getImage);
router.get('/tasks/:id', FileController.getTask);

module.exports = router;