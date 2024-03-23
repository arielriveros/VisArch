const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'files/';
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

const uploadModel = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let extension = path.extname(file.originalname);
    if (extension !== '.glb' && extension !== '.png' && extension !== '.jpg' && extension !== '.jpeg')
      return cb(new Error('Unsupported file type.'));

    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 1024
  }
});

module.exports = uploadModel