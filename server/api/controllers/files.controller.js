const fs = require('fs');
const AdmZip = require('adm-zip');
const Task = require('../models/Task');

async function getMesh(req, res) {
  try {
    const filePath = `files/${req.params.id}`;
    const readStream = fs.createReadStream(filePath);
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    // content type is glb file binary
    res.contentType('model/gltf-binary');

    res.setHeader('Content-Length', fileSizeInBytes);
    // pipe the read stream to the response
    readStream.pipe(res);
    readStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ msg: err.message });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function getImage(req, res) {
  try {
    // get file from public/meshFiles
    const file = fs.readFileSync(`files/${req.params.id}`);
    // content type is image
    res.contentType('image/png');
    // send file
    res.send(file);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function getTask(req, res) {
  try {
    const task = await Task.findById(req.params.id).lean();
    if (!task)
      return res.status(404).json({ msg: 'Task not found' });

    task.annotations.forEach(annotation => {
      annotation.entities.forEach((entity, j) => {
        if (annotation.archetype === entity.id) {
          annotation.archetype = j;
          return;
        }
      });
    });

    const jsonData = JSON.stringify(
      task, 
      ['name', 'description', 'annotations', 'archetype',
      'label', 'entities', 'faces', 'scale', 'orientation', 'reflection'],
      2);

    const zip = new AdmZip();

    // add file directly
    zip.addFile(`${task.name}.json`, Buffer.from(jsonData, "utf8"));
    zip.addLocalFile(`files/${task.mesh}`, undefined, `${task.name}.glb`);
    zip.addLocalFile(`files/${task.thumbnail}`, undefined, `${task.name}.png`);
    // get everything as a buffer
    const zipBuffer = zip.toBuffer();
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename=${task.name}.zip`);
    res.set('Content-Length', zipBuffer.length);
    res.send(zipBuffer);
  }
  catch (error) {
    console.error('Error in downloadTask:', error);
    res.status(500).json({ msg: error.message });
  }
}

module.exports = {
  getMesh,
  getImage,
  getTask
}