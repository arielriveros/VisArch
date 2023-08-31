import { BufferGeometry, NormalBufferAttributes, Vector3 } from "three";

export function calculateBoundingBox(faces: number[], geometry: BufferGeometry<NormalBufferAttributes> | null) {
    if(!geometry ) return;

    const indices: number[] = [];
    const indexAttr = geometry.index;
    for (let i = 0; i < faces.length; i++) {
        const index = faces[i] * 3;
        const a = index + 0;
        const b = index + 1;
        const c = index + 2;
        indices.push(a, b, c);
    }

    const positionAttrib = geometry.attributes.position.array;
    const positionVectors = []

    for ( let i = 0, l = indices.length; i < l; i ++ ) {
        const ix = indexAttr?.getX( indices[i] );
        const x = positionAttrib[ix as number * 3];
        const y = positionAttrib[ix as number * 3 + 1];
        const z = positionAttrib[ix as number * 3 + 2];
        positionVectors.push(new Vector3(x, y, z));
    }

    const centroid = new Vector3();

    for (let i = 0; i < positionVectors.length; i++)
        centroid.add(positionVectors[i]);

    centroid.divideScalar(positionVectors.length);

    const minX = Math.min(...positionVectors.map(v => v.x));
    const minY = Math.min(...positionVectors.map(v => v.y));
    const minZ = Math.min(...positionVectors.map(v => v.z));
    const maxX = Math.max(...positionVectors.map(v => v.x));
    const maxY = Math.max(...positionVectors.map(v => v.y));
    const maxZ = Math.max(...positionVectors.map(v => v.z));

    const boundingBox = {
        min: new Vector3(minX, minY, minZ),
        max: new Vector3(maxX, maxY, maxZ)
    }

    return {
        centroid: {
            x: centroid.x,
            y: centroid.y,
            z: centroid.z
        },
        boundingBox: {
            min: {
                x: boundingBox.min.x,
                y: boundingBox.min.y,
                z: boundingBox.min.z
            },
            max: {
                x: boundingBox.max.x,
                y: boundingBox.max.y,
                z: boundingBox.max.z
            }
        }
    };
}