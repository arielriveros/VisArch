export function flattenAxis(vertices: number[], axis: 'x' | 'y' | 'z', tolerance: number) {
    const flattenedVertices = [];

    for (let i = 0; i < vertices.length; i += 3) {
        let [x, y, z] = vertices.slice(i, i + 3);

        switch (axis) {
            case 'x':
                [x, y, z] = [x*tolerance, y, z];
                break;
            case 'y':
                [x, y, z] = [x, y*tolerance, z];
                break;
            case 'z':
                [x, y, z] = [x, y, z*tolerance];
                break;
        }

        flattenedVertices.push(x, y, z);
    }

    return flattenedVertices;
}
