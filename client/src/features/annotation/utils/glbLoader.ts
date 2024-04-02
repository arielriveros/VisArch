import { Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export async function loadMeshFromUrl(url: string, onLoaded?: ()=>void, onProgress?: (current: number, total: number, text: string) => void): Promise<Mesh> {
  return new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.withCredentials = true;
    gltfLoader.load(
      url,
      (gltf) => {
        const mesh = gltf.scene.children[0] as Mesh;
        resolve(mesh);
        onLoaded?.();
      },
      (progressEvent) => {
        onProgress?.(progressEvent.loaded, progressEvent.total, 'Loading mesh');
      },
      (error) => {
        reject(error);
      }
    );
  });
}
