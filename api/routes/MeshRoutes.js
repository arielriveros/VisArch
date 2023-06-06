const express = require('express');
const router = express.Router();
const MeshController = require('../controllers/MeshController');

router.get('/', MeshController.index);
router.post('/', MeshController.create);
router.delete('/:id', MeshController.destroy);

module.exports = router;