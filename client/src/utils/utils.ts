import { BufferGeometry, Euler, Mesh, NormalBufferAttributes, Quaternion, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

export async function loadGeometry(modelPath: string, format: string): Promise<BufferGeometry> {
  let geometry: BufferGeometry<NormalBufferAttributes> = new BufferGeometry();
  if (format === 'obj') {
    // Load OBJ
    const objLoader = new OBJLoader();
    const group = await objLoader.loadAsync(modelPath);
    group.traverse(child => {
      if (child instanceof Mesh) {
        geometry = child.geometry;
      }
    });
  }
  else if (format === 'ply') {
    const plyLoader = new PLYLoader();
    geometry = await plyLoader.loadAsync(modelPath);
  }
  else
    throw new Error('Invalid format');

  return geometry;
}

export function adjustMesh(mesh: Mesh) {
  // get obj bounding box
  mesh.geometry.computeBoundingSphere();
  const boundingSphere = mesh.geometry.boundingSphere;
  if (!boundingSphere) return;

  const center = boundingSphere.center;

  // set obj position to center
  // update vertex positions
  for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
    mesh.geometry.attributes.position.setXYZ(
      i,
      mesh.geometry.attributes.position.getX(i) - center.x,
      mesh.geometry.attributes.position.getY(i) - center.y,
      mesh.geometry.attributes.position.getZ(i) - center.z
    );
  }

  // Make the object size to be 1
  const scale = 1 / boundingSphere.radius;
  mesh.scale.set(scale, scale, scale); 

  // Compute bvh for index generation
  mesh.geometry.computeBoundsTree();
}

export function adjustRotation(mesh: Mesh) {
  // calculate the average normal vector of the mesh
  const avgNormal = new Vector3();
  const normalAttribute = mesh.geometry.attributes.normal;
  for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
    const normal = new Vector3();
    normal.fromBufferAttribute(normalAttribute, i);
    avgNormal.add(normal);
  }

  avgNormal.normalize();

  // rotate the mesh so that the average normal vector is pointing upwards
  const angleX = Math.acos(avgNormal.dot(new Vector3(0, 1, 0)));
  const angleZ = Math.atan2(avgNormal.x, avgNormal.y);


  // apply rotation to the geometry
  const rotationQuaternion = new Quaternion();
  rotationQuaternion.setFromEuler(
    new Euler(-angleX, 0, angleZ)
  );
  mesh.geometry.applyQuaternion(rotationQuaternion);
}

export async function convertToGLB(mesh: Mesh): Promise<File> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
  
    exporter.parse(
      mesh,
      gltf => {
        const blob = new Blob([gltf as BlobPart], { type: 'application/octet-stream' });
        const glbFile = new File([blob], `${mesh.name}.glb`, { type: 'model/gltf-binary' });
        resolve(glbFile);
      },
      error => reject(error),
      { binary: true }
    );
  });
}

export async function pngFromMesh(mesh: Mesh): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      reject();
      return;
    }
    canvas.toBlob(blob => {
      // download the image
      if (blob)
        resolve(new File([blob], `${mesh.name}.png`, { type: blob.type }));
    }, 'image/png', 0.5);
  });
}