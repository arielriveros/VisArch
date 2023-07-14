const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `public/meshFiles/${file.originalname.split('.')[0]}`;
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadModel = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        let extension = path.extname(file.originalname);
        if (extension !== '.glb') {
            return cb(new Error('Only .glb files are allowed.'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 1024
    }
});

module.exports = uploadModel;