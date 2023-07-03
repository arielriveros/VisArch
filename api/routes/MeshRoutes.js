const express = require('express');
const router = express.Router();
const MeshController = require('../controllers/MeshController');
const uploadModel = require('../middleware/upload');

router.get('/', MeshController.index);
// TODO: Check post if upload failed
router.post('/', uploadModel.fields(
    [
        { name: 'model', maxCount: 1 },
        { name: 'material', maxCount: 1 },
        { name: 'texture', maxCount: 1 }
    ]
), MeshController.create);

// TODO: Also remove the files from the public folder
router.delete('/:id', MeshController.destroy);

module.exports = router;