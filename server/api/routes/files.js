const express = require('express');
const router = express.Router();
const FileController = require('../controllers/file');

router.get('/:id', FileController.getModel);

module.exports = router;