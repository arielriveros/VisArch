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

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        let extension = path.extname(file.originalname);
        if (extension !== '.obj') {
            return cb(new Error('Only .obj files are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 1024
    }
});

module.exports = upload;