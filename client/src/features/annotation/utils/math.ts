import { BufferAttribute, BufferGeometry, Vector3, Line3 } from 'three';
import { generateUUID } from 'three/src/math/MathUtils';

export function uuid() {
  return generateUUID();
}

export function getFacesFromIndex(faceIndex: number, geometry: BufferGeometry): { a: number, b: number, c: number } | null {
  const index = geometry.index;
  if (!index) return null;

  const indexValue1 = index.array[faceIndex * 3];
  const indexValue2 = index.array[faceIndex * 3 + 1];
  const indexValue3 = index.array[faceIndex * 3 + 2];

  return { a: indexValue1, b: indexValue2, c: indexValue3 };
}

/* For a given faceIndex returns the triangle vertices, average normal and centroid */
export function getTriangleFromIndex(faceIndex: number, geometry: BufferGeometry): {a: Vector3, b: Vector3, c: Vector3, normal: Vector3, centroid: Vector3} | null {
  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;

  const faces = getFacesFromIndex(faceIndex, geometry);
  if (!faces) return null;
  const { a: indexValue1, b: indexValue2, c: indexValue3 } = faces;

  if (!indexValue1 || !indexValue2 || !indexValue3) return null;

  const a = new Vector3(
    positions[indexValue1 * 3],
    positions[indexValue1 * 3 + 1],
    positions[indexValue1 * 3 + 2]
  );

  const b = new Vector3(
    positions[indexValue2 * 3],
    positions[indexValue2 * 3 + 1],
    positions[indexValue2 * 3 + 2]
  );

  const c = new Vector3(
    positions[indexValue3 * 3],
    positions[indexValue3 * 3 + 1],
    positions[indexValue3 * 3 + 2]
  );

  const centroid = new Vector3(
    (a.x + b.x + c.x) / 3,
    (a.y + b.y + c.y) / 3,
    (a.z + b.z + c.z) / 3
  );

  const aNormal = new Vector3(
    normals[indexValue1 * 3],
    normals[indexValue1 * 3 + 1],
    normals[indexValue1 * 3 + 2]
  );

  const bNormal = new Vector3(
    normals[indexValue2 * 3],
    normals[indexValue2 * 3 + 1],
    normals[indexValue2 * 3 + 2]
  );

  const cNormal = new Vector3(
    normals[indexValue3 * 3],
    normals[indexValue3 * 3 + 1],
    normals[indexValue3 * 3 + 2]
  );

  const normal = new Vector3(
    (aNormal.x + bNormal.x + cNormal.x) / 3,
    (aNormal.y + bNormal.y + cNormal.y) / 3,
    (aNormal.z + bNormal.z + cNormal.z) / 3
  );

  return { a, b, c, normal, centroid};
}

export function indexToFaces(indices: number[]): number[] {
  return indices
    .filter((_, i) => i % 3 === 0)
    .map(index => index / 3);
}

export function facesToIndex(faces: number[]): number[] {
  return faces.flatMap(face => [face * 3, face * 3 + 1, face * 3 + 2]);
}

export const rgbToHex = (rgbColor: number[]) => {
  const compToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + compToHex(Math.round(rgbColor[0])) + compToHex(Math.round(rgbColor[1])) + compToHex(Math.round(rgbColor[2]));
};

export const hexToRgb = (hexColor: string) => {
  return hexColor.match(/[A-Za-z0-9]{2}/g)!.map(function(v) { return parseInt(v, 16);});
};

export function unwrap(geometry: BufferGeometry, axis: 'none' | 'x' | 'y' | 'z' = 'y') {
  const newGeometry = geometry.clone();
  if ( !newGeometry.index || axis === 'none' ) return newGeometry;

  let ax1: number, ax2: number;
  switch(axis) {
  case 'x':
    ax1 = 1;
    ax2 = 2;
    break;
  case 'y':
    ax1 = 0;
    ax2 = 2;
    break;
  case 'z':
    ax1 = 0;
    ax2 = 1;
    break;
  }

  _cylindrify(newGeometry, ax1, ax2);
  _unwrapCylinder(newGeometry, ax1, ax2);
  const rotation = new Vector3();
  switch(axis) {
  case 'x':
    rotation.set(0, Math.PI, Math.PI / 2);
    break;
  case 'y':
    rotation.set(0, Math.PI, 0);
    break;
  case 'z':
    rotation.set(Math.PI / 2, Math.PI, Math.PI);
    break;
  }
  newGeometry.rotateX(rotation.x);
  newGeometry.rotateY(rotation.y);
  newGeometry.rotateZ(rotation.z);
  return newGeometry;
}

function _cylindrify(geometry: BufferGeometry, ax1: number, ax2: number): void {
  if (!geometry.index) return;
  const projection_radius = 1.0;

  const positions: number[] = [];
  for(let i = 0; i < geometry.attributes.position.array.length; i+=3) {
    const pos = geometry.attributes.position.array.slice(i, i + 3);
    const point_radius = Math.sqrt(pos[ax1]*pos[ax1] + pos[ax2]*pos[ax2]);
    pos[ax1] *= projection_radius / point_radius;
    pos[ax2] *= projection_radius / point_radius;
    positions.push(...pos);
  }

  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
}

function _unwrapCylinder(geometry: BufferGeometry, ax1: number, ax2: number): void {
  if ( !geometry.index) return;
  const positions = geometry.attributes.position.array;

  // Unwrap positions based on cylindrical coordinates
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i + ax1];
    const y = positions[i + ax2];
    const radius = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);

    // Assign unwrapped positions
    positions[i + ax1] = theta; // Assigning theta as new x coordinate
    positions[i + ax2] = radius; // Assigning radius as new y (or z) coordinate
  }

  // Update buffer attribute with new positions
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
}

/* 
Adaptation of https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/selection.js for typescript.
All credit goes to the original author.
*/
 
// Math Functions
// https://www.geeksforgeeks.org/convex-hull-set-2-graham-scan/
export function getConvexHull( points: Vector3[] ): Vector3[] | null {
  const orientation = ( p: Vector3, q: Vector3, r: Vector3 ) => {
    const val =
			( q.y - p.y ) * ( r.x - q.x ) -
			( q.x - p.x ) * ( r.y - q.y );
    if ( val === 0 )
      return 0; // colinear

    // clockwise or counterclockwise
    return ( val > 0 ) ? 1 : 2;
  };

  const distSq = (p1: Vector3, p2: Vector3) => {
    return ( p1.x - p2.x ) * ( p1.x - p2.x ) + ( p1.y - p2.y ) * ( p1.y - p2.y );
  };

  const compare = ( p1: Vector3, p2: Vector3 ) => {
    // Find orientation
    const o = orientation( p0, p1, p2 );
    if ( o === 0 )
      return ( distSq( p0, p2 ) >= distSq( p0, p1 ) ) ? - 1 : 1;

    return ( o === 2 ) ? - 1 : 1;
  };
  // find the lowest point in 2d
  let lowestY = Infinity;
  let lowestIndex = - 1;
  for (let i = 0, l = points.length; i < l; i ++ ) {
    const p = points[i];
    if (p.y < lowestY) {
      lowestIndex = i;
      lowestY = p.y;
    }
  }
  // sort the points
  const p0 = points[lowestIndex];
  points[lowestIndex] = points[0];
  points[0] = p0;

  points = points.sort( compare );

  // filter the points
  let m = 1;
  const n = points.length;
  for ( let i = 1; i < n; i ++ ) {
    while ( i < n - 1 && orientation( p0, points[ i ], points[ i + 1 ] ) === 0 )
      i ++;

    points[m] = points[i];
    m ++;
  }

  // early out if we don't have enough points for a hull
  if ( m < 3 ) return null;

  // generate the hull
  const hull = [ points[ 0 ], points[ 1 ], points[ 2 ] ];
  for ( let i = 3; i < m; i ++ ) {
    while ( orientation( hull[ hull.length - 2 ], hull[ hull.length - 1 ], points[ i ] ) !== 2 )
      hull.pop();

    hull.push( points[ i ] );
  }
  return hull;
}

export function pointRayCrossesLine( point: Vector3, line: Line3, prevDirection: boolean, thisDirection: boolean ) {
  const { start, end } = line;
  const px = point.x;
  const py = point.y;

  const sy = start.y;
  const ey = end.y;

  if ( sy === ey ) return false;

  if ( py > sy && py > ey ) return false; // above
  if ( py < sy && py < ey ) return false; // below

  const sx = start.x;
  const ex = end.x;
  if ( px > sx && px > ex ) return false; // right
  if ( px < sx && px < ex ) { // left
    if ( py === sy && prevDirection !== thisDirection )
      return false;

    return true;
  }

  // check the side
  const dx = ex - sx;
  const dy = ey - sy;
  const perpx = dy;
  const perpy = - dx;

  const pdx = px - sx;
  const pdy = py - sy;

  const dot = perpx * pdx + perpy * pdy;

  if (Math.sign( dot ) !== Math.sign(perpx))
    return true;

  return false;
}

export function pointRayCrossesSegments(point: Vector3, segments: Line3[]) {
  let crossings = 0;
  const firstSeg = segments[ segments.length - 1 ];
  let prevDirection = firstSeg.start.y > firstSeg.end.y;
  for ( let s = 0, l = segments.length; s < l; s ++ ) {
    const line = segments[ s ];
    const thisDirection = line.start.y > line.end.y;
    if (pointRayCrossesLine(point, line, prevDirection, thisDirection))
      crossings ++;
    prevDirection = thisDirection;
  }

  return crossings;
}

// https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect
export function lineCrossesLine(l1: Line3, l2: Line3) {
  const ccw = (A: Vector3, B: Vector3, C: Vector3) => {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  };

  const A = l1.start;
  const B = l1.end;

  const C = l2.start;
  const D = l2.end;

  return ccw( A, C, D ) !== ccw( B, C, D ) && ccw( A, B, C ) !== ccw( A, B, D );
}
