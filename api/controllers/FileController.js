const fs = require('fs');

async function getFile(req, res) {
    try {
        // get file from public/meshFiles
        const file = fs.readFileSync(`public/${req.params.path}/${req.params.id}`);
        // content type is glb file binary
        res.contentType("model/gltf-binary");
        // send file
        res.send(file);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message });
    }
}

module.exports = {
    getFile
}