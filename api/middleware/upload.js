const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `public/meshFiles/`;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const newFilename = `${uuidv4()}-${Date.now()}-${path.extname(file.originalname)}`;
        cb(null, newFilename);
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