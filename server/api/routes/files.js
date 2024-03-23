const express = require('express');
const router = express.Router();
const FileController = require('../controllers/file');

router.get('/models/:id', FileController.getModel);
router.get('/images/:id', FileController.getImage);

module.exports = router;