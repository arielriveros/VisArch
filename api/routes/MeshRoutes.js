const express = require('express');
const router = express.Router();
const MeshController = require('../controllers/MeshController');
const uploadModel = require('../middleware/upload');

router.get('/', MeshController.index);
router.post('/', uploadModel.fields(
    [
        { name: 'model', maxCount: 1 },
        { name: 'material', maxCount: 1 },
        { name: 'texture', maxCount: 1 }
    ]
), MeshController.create);
router.delete('/:id', MeshController.destroy);

module.exports = router;