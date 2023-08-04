export function radialUnwrap(vertices: number[], axis: 'x' | 'y' | 'z' = 'y') {
    const unwrappedPositions = [];

    for (let i = 0; i < vertices.length; i += 3) {
        let [x, y, z] = vertices.slice(i, i + 3);

        switch (axis) {
			case 'x':
				[x, y, z] = [y, z, x];
				break;
			case 'y':
				[x, y, z] = [x, y, z];
				break;
			case 'z':
				[x, y, z] = [z, x, y];
				break;
        }
        
        const r = Math.sqrt(x * x + y * y + z * z);
        const theta = Math.atan2(z, x);
        const phi = Math.acos(y / r);

        unwrappedPositions.push(r, theta, phi);
    }

    return unwrappedPositions;
};