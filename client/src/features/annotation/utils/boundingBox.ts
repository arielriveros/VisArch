import { BufferGeometry, NormalBufferAttributes, Vector3 } from "three";

export function calculateBoundingBox(faces: number[], geometry: BufferGeometry<NormalBufferAttributes> | null) {
    if(!geometry ) return;

    const indexAttr = geometry.index;
    const positionAttrib = geometry.attributes.position.array;
    const positionVectors = []

    for (let i = 0; i < faces.length; i+=3) {
        const index = indexAttr?.getX( faces[i] * 3 );
        const x = positionAttrib[index as number * 3];
        const y = positionAttrib[index as number * 3 + 1];
        const z = positionAttrib[index as number * 3 + 2];

        positionVectors.push(new Vector3(x, y, z));
    }

    const centroid = new Vector3();

    for (let i = 0; i < positionVectors.length; i++)
        centroid.add(positionVectors[i]);

    centroid.divideScalar(positionVectors.length);

    let minX = centroid.x;
    let maxX = centroid.x;
    let minY = centroid.y;
    let maxY = centroid.y;
    let minZ = centroid.z;
    let maxZ = centroid.z;

    for (let v of positionVectors) {
        let tempMinxX = v.x;
        let tempMinxY = v.y;
        let tempMinZ = v.z;
        let tempMaxX = v.x;
        let tempMaxY = v.y;
        let tempMaxZ = v.z;

        if (tempMinxX < minX) minX = tempMinxX;
        if (tempMinxY < minY) minY = tempMinxY;
        if (tempMinZ < minZ) minZ = tempMinZ;
        if (tempMaxX > maxX) maxX = tempMaxX;
        if (tempMaxY > maxY) maxY = tempMaxY;
        if (tempMaxZ > maxZ) maxZ = tempMaxZ;
    }

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