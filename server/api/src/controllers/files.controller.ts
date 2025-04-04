import { Request, Response } from 'express';
import { Readable } from 'stream';
import * as fs from 'fs';
import AdmZip from 'adm-zip';
import Task from '../models/Task';

async function getMesh(req: Request, res: Response): Promise<void> {
  try {
    const filePath = `files/${req.params.id}`;
    const readStream = fs.createReadStream(filePath);
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;

    res.contentType('model/gltf-binary');
    res.setHeader('Content-Length', fileSizeInBytes);

    readStream.pipe(res);
    readStream.on('error', (err: Error) => {
      console.error(err);
      res.status(500).json({ msg: err.message });
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
}

async function getImage(req: Request, res: Response): Promise<void> {
  try {
    const file = fs.readFileSync(`files/${req.params.id}`);
    res.contentType('image/png');
    res.send(file);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
}

async function getTask(req: Request, res: Response): Promise<void> {
  try {
    const task = await Task.findById(req.params.id).lean();
    if (!task) {
      res.status(404).json({ msg: 'Task not found' });
      return;
    }

    task.annotations.forEach((annotation: any) => {
      annotation.entities.forEach((entity: any, j: number) => {
        if (annotation.archetype === entity.id) {
          annotation.archetype = j;
          return;
        }
      });
    });

    const jsonData = JSON.stringify(
      task,
      [
        'name',
        'description',
        'annotations',
        'archetype',
        'label',
        'entities',
        'faces',
        'scale',
        'orientation',
        'reflection',
      ],
      2
    );

    const zip = new AdmZip();
    zip.addFile(`${task.name}.json`, Buffer.from(jsonData, 'utf8'));
    zip.addLocalFile(`files/${task.mesh}`, undefined, `${task.name}.glb`);
    zip.addLocalFile(`files/${task.thumbnail}`, undefined, `${task.name}.png`);

    const zipBuffer = zip.toBuffer();

    res.set('Content-Type', 'application/zip');
    res.set('Content-Length', zipBuffer.length.toString());

    const readStream = Readable.from(zipBuffer);
    readStream.pipe(res);
    readStream.on('error', (err: Error) => {
      console.error(err);
      res.status(500).json({ msg: err.message });
    });
  } catch (error: any) {
    console.error('Error in downloadTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

export default {
  getMesh,
  getImage,
  getTask,
};