const express = require('express');
const router = express.Router();
const MeshController = require('../controllers/MeshController');
const upload = require('../middleware/upload');

router.get('/', MeshController.index);
router.post('/', upload.single('model'), MeshController.create);
router.delete('/:id', MeshController.destroy);

module.exports = router;