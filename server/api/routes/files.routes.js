const express = require('express');
const router = express.Router();
const FileController = require('../controllers/files.controller');

router.get('/models/:id', FileController.getModel);
router.get('/images/:id', FileController.getImage);

module.exports = router;