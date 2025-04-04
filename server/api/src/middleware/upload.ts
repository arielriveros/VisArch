import path from 'path';
import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const dir = 'files/';
    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const newFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

const uploadMesh = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension !== '.glb' && extension !== '.png' && extension !== '.jpg' && extension !== '.jpeg') {
      return cb(new Error('Unsupported file type.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1 GB
  }
});

export default uploadMesh;