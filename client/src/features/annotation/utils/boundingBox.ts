import { BufferGeometry, NormalBufferAttributes, Vector3 } from "three";

export function calculateBoundingBox(faces: number[], geometry: BufferGeometry<NormalBufferAttributes>) {
    const indexAttr = geometry.index;
    const positionAttrib = geometry.attributes.position.array;
    const normalAttrib = geometry.attributes.normal.array;
    const positionVectors = []
    const normalVectors = []

    for (let i = 0; i < faces.length; i+=3) {
        const index = indexAttr?.getX( faces[i] * 3 );
        const x = positionAttrib[index as number * 3];
        const y = positionAttrib[index as number * 3 + 1];
        const z = positionAttrib[index as number * 3 + 2];

        positionVectors.push(new Vector3(x, y, z));

        const nx = normalAttrib[index as number * 3];
        const ny = normalAttrib[index as number * 3 + 1];
        const nz = normalAttrib[index as number * 3 + 2];

        normalVectors.push(new Vector3(nx, ny, nz));
    }

    const centroid = new Vector3();

    for (let i = 0; i < positionVectors.length; i++)
        centroid.add(positionVectors[i]);

    centroid.divideScalar(positionVectors.length);

    const centroidNormal = new Vector3();

    for (let i = 0; i < normalVectors.length; i++)
        centroidNormal.add(normalVectors[i]);

    centroidNormal.normalize();

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

    return { centroid, boundingBox, centroidNormal };
}