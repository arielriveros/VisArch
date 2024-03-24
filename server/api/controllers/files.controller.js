const fs = require('fs');

async function getModel(req, res) {
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

module.exports = {
  getModel,
  getImage
}