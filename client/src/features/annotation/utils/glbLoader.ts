import { Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export async function loadModelFromUrl(url: string): Promise<Mesh> {
  return new Promise( (resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Accept': 'model/gltf-binary',
      },
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok)
          throw new Error('Failed to fetch model');
    
        return response.blob();
      })
      .then((blob) => {
        return blob.arrayBuffer();
      })
      .then((arrayBuffer) => {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(URL.createObjectURL(new Blob([arrayBuffer])), (gltf) => {
          const mesh = gltf.scene.children[0] as Mesh;
          resolve(mesh);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}