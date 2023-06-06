const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `public/meshFiles/`;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        let extension = path.extname(file.originalname);
        cb(null, `${Date.now()}${extension}`);
    }
});

const uploadModel = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        let extension = path.extname(file.originalname);
        if (extension !== '.obj' &&
            extension !== '.mtl' &&
            extension !== '.png' &&
            extension !== '.jpg' &&
            extension !== '.jpeg') {
            return cb(new Error('Only .obj, .mtl, .png, .jpg and .jpeg files are allowed.'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 1024
    }
});

module.exports = uploadModel;