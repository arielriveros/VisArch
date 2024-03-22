/* 
Adaptation of https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/selection.js for react-three-fiber.
All credit goes to the original author.
*/

import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import { 
  Line,
  BufferGeometry,
  LineBasicMaterial,
  Float32BufferAttribute,
  MathUtils,
  PerspectiveCamera,
  Vector2,
  Matrix4,
  Line3,
  Mesh,
  Vector3,
  Ray,
  FrontSide } from 'three';
import { NOT_INTERSECTED, INTERSECTED, CONTAINED } from 'three-mesh-bvh';
import { getConvexHull, pointRayCrossesSegments, lineCrossesLine, getFacesFromIndex, indexToFaces } from '../utils/math';
import useConfig from '../hooks/useConfig';
import Emitter from '../utils/emitter';
import useAnnotation from '../hooks/useAnnotation';

const DEG2RAD = MathUtils.DEG2RAD;

const SelectionController = () => {
  const { camera, scene, pointer } = useThree();
  const { tool } = useConfig();
  const { selectedArchetype, addEntity } = useAnnotation();
  const toolRef = useRef(tool);
  const isDownRef = useRef(false);
  const addEntityRef = useRef(addEntity);
  useEffect(() => { toolRef.current = tool; }, [tool]);

  const selectionShape = useRef<Line>(
    new Line(
      new BufferGeometry(),
      new LineBasicMaterial({ 
        color: 0xff9800,
        toneMapped: false,
        transparent: true,
        linewidth: 1.5
      })
    )
  );
  const selectionPoints = useRef<number[]>([]);
  const prevRef = useRef<{ x: number; y: number }>({ x: -Infinity, y: -Infinity });

  const handleSelectionShape = useCallback(() => {
    const ogLength = selectionPoints.current.length;
    selectionPoints.current.push(...selectionPoints.current.slice(0, 3));

    selectionShape.current.geometry.setAttribute(
      'position', new Float32BufferAttribute( selectionPoints.current, 3, false )
    );

    selectionPoints.current.length = ogLength;
    selectionShape.current.frustumCulled = false;

    // TODO: Manage camera if orthographic
    if (camera instanceof PerspectiveCamera) {
      const yScale = Math.tan(DEG2RAD * camera.fov / 2 ) * selectionShape.current.position.z;
      selectionShape.current.scale.set( -yScale * camera.aspect, -yScale, 1 );
    }
  }, [camera]);

  const handleSelection = useCallback(() => {
    const proxyMesh = scene.getObjectByName('proxy') as Mesh;
    if (!proxyMesh) return;
    const selectionIndices: number[] = [];
    const boxPoints = new Array(8).fill(0).map(() => new Vector3());
    const boxLines = new Array(12).fill(0).map(() => new Line3());
    const perBoundsSegments: Line3[][] = [];
    const toScreenSpaceMatrix = new Matrix4()
      .copy(proxyMesh.matrixWorld)
      .premultiply(camera.matrixWorldInverse)
      .premultiply(camera.projectionMatrix);

    // create scratch points and lines to use for selection
    const lassoSegments: Line3[] = [];
    while (lassoSegments.length < selectionPoints.current.length)
      lassoSegments.push(new Line3());

    lassoSegments.length = selectionPoints.current.length;

    for ( let s = 0, l = selectionPoints.current.length; s < l; s += 3 ) {
      const line = lassoSegments[s];
      const sNext = ( s + 3 ) % l;
      line.start.x = selectionPoints.current[s];
      line.start.y = selectionPoints.current[s + 1];
    
      line.end.x = selectionPoints.current[sNext];
      line.end.y = selectionPoints.current[sNext + 1];
    }

    const invWorldMatrix = new Matrix4().copy(proxyMesh.matrixWorld).invert();
    const camLocalPosition = new Vector3().applyMatrix4(camera.matrixWorld).applyMatrix4(invWorldMatrix);

    proxyMesh.geometry.boundsTree?.shapecast({
      intersectsBounds: (box, isLeaf, score, depth) => {
        // Get the bounding box points
        const { min, max } = box;
        let index = 0;
                
        let minY = Infinity;
        let maxY = -Infinity;
        let minX = Infinity;
        for ( let x = 0; x <= 1; x ++ ) 
          for ( let y = 0; y <= 1; y ++ )
            for ( let z = 0; z <= 1; z ++ ) {
              const v = boxPoints[ index ];
              v.x = x === 0 ? min.x : max.x;
              v.y = y === 0 ? min.y : max.y;
              v.z = z === 0 ? min.z : max.z;
              //v.w = 1;
              v.applyMatrix4(toScreenSpaceMatrix);
              index ++;

              if ( v.y < minY ) minY = v.y;
              if ( v.y > maxY ) maxY = v.y;
              if ( v.x < minX ) minX = v.x;
            }

        // Find all the relevant segments here and cache them in the above array for
        // subsequent child checks to use.
        const parentSegments = perBoundsSegments[ depth - 1 ] || lassoSegments;
        const segmentsToCheck = perBoundsSegments[ depth ] || [];
        segmentsToCheck.length = 0;
        perBoundsSegments[ depth ] = segmentsToCheck;
        for ( let i = 0, l = parentSegments.length; i < l; i ++ ) {

          const line = parentSegments[ i ];
          const sx = line.start.x;
          const sy = line.start.y;
          const ex = line.end.x;
          const ey = line.end.y;
          if ( sx < minX && ex < minX ) continue;

          const startAbove = sy > maxY;
          const endAbove = ey > maxY;
          if ( startAbove && endAbove ) continue;

          const startBelow = sy < minY;
          const endBelow = ey < minY;
          if ( startBelow && endBelow ) continue;

          segmentsToCheck.push( line );
        }

        if ( segmentsToCheck.length === 0 )
          return NOT_INTERSECTED;

        // Get the screen space hull lines
        const hull = getConvexHull( boxPoints );
        if ( !hull ) return NOT_INTERSECTED;

        const lines = hull?.map((p, i) => {
          const vector = new Vector3(p.x, p.y, 0);
          const nextP = hull[(i + 1) % hull.length];
          const nextVector = new Vector3(nextP.x, nextP.y);
          const line = boxLines[i];
          line.start.copy(vector);
          line.end.copy(nextVector);
          return line;
        });

        // If a lasso point is inside the hull then it's intersected and cannot be contained
        if (pointRayCrossesSegments( segmentsToCheck[0].start, lines ) % 2 === 1)
          return INTERSECTED;

        // check if the screen space hull is in the lasso
        let crossings = 0;
        for (let i = 0, l = hull.length; i < l; i ++) {
          const v = hull[i];
          const pCrossings = pointRayCrossesSegments(v, segmentsToCheck);

          if ( i === 0 )
            crossings = pCrossings;

          // if two points on the hull have different amounts of crossings then
          // it can only be intersected
          if ( crossings !== pCrossings )
            return INTERSECTED;
        }

        // check if there are any intersections
        for ( let i = 0, l = lines.length; i < l; i ++ ) {
          const boxLine = lines[i];
          for (let s = 0, ls = segmentsToCheck.length; s < ls; s ++) 
            if (lineCrossesLine( boxLine, segmentsToCheck[s]))
              return INTERSECTED;
        }

        return crossings % 2 === 0 ? NOT_INTERSECTED : CONTAINED;
      },

      intersectsTriangle: (tri, index, contained, depth) => {
        // check all the segments if using no bounds tree
        const segmentsToCheck = perBoundsSegments[depth];

        // get the center of the triangle
        const centroid = new Vector3().copy(tri.a).add(tri.b).add(tri.c).multiplyScalar(1/3);
        const screenCentroid = new Vector3().copy(centroid).applyMatrix4(toScreenSpaceMatrix);

        // counting the crossings
        if (contained || pointRayCrossesSegments( screenCentroid, segmentsToCheck ) % 2 === 1) {
          const faceNormal = tri.getNormal(new Vector3());
          const tempRay = new Ray();
          tempRay.origin.copy( centroid ).addScaledVector( faceNormal, 1e-6 );
          tempRay.direction.subVectors( camLocalPosition, centroid );

          const res = proxyMesh.geometry.boundsTree?.raycastFirst(tempRay, FrontSide);
          if (res) return false;

          const faces = getFacesFromIndex(index, proxyMesh.geometry);
          if (faces)
            selectionIndices.push(faces.a, faces.b, faces.c);

          return false;
        }

        return false;
      }
    });
    if (selectedArchetype)
      addEntityRef.current(selectedArchetype, indexToFaces(selectionIndices));
    else {
      Emitter.emit('HIGHLIGHT_FACES', indexToFaces(selectionIndices));
      alert('Select an Archetype first');
    }
  }, [camera, scene, selectedArchetype]);

  const pointerDownListener = useCallback((e: MouseEvent) => {
    if (toolRef.current !== 'lasso') return;
    prevRef.current.x = e.clientX;
    prevRef.current.y = e.clientY;
    selectionPoints.current.length = 0;
    if (e.button === 0) 
      isDownRef.current = true;
  }, []);

  const pointerUpListener = useCallback(() => {
    if (toolRef.current !== 'lasso') return;
    isDownRef.current = false;
    selectionShape.current.visible = false;
    
    handleSelectionShape();
    if ( selectionPoints.current.length > 6 )
      handleSelection();
  }, [handleSelectionShape, handleSelection]);

  const pointerMoveListener = useCallback((e: MouseEvent) => {
    if (toolRef.current !== 'lasso') return;
    // If not down, ignore
    if (!isDownRef.current ) return;

    const ex = e.clientX;
    const ey = e.clientY;

    const nx = pointer.x;
    const ny = pointer.y;

    // If the mouse hasn't moved a lot since the last point
    if (Math.abs(ex - prevRef.current.x) >= 3 || Math.abs(ey - prevRef.current.y) >= 3) {
      // Check if the mouse moved in roughly the same direction as the previous point
      // and replace it if so.
      const i = selectionPoints.current.length / 3 - 1;
      const i3 = i * 3;
      let doReplace = false;
      if (selectionPoints.current.length > 3) {
        // prev segment direction
        const tempVec0 = new Vector2(selectionPoints.current[ i3 - 3 ], selectionPoints.current[ i3 - 3 + 1 ]);
        const tempVec1 = new Vector2(selectionPoints.current[ i3 ], selectionPoints.current[ i3 + 1 ]);
        tempVec1.sub(tempVec0).normalize();

        // this segment direction
        const tempVec2 = new Vector2(selectionPoints.current[ i3 ], selectionPoints.current[ i3 + 1 ]);
        const tempVec3 = new Vector2(nx, ny);
        tempVec3.sub(tempVec2).normalize();

        const dot = tempVec1.dot(tempVec3);
        doReplace = dot > 0.99;
      }

      if (doReplace) {
        selectionPoints.current[i3] = nx;
        selectionPoints.current[i3 + 1] = ny;
      }
      else
        selectionPoints.current.push(nx, ny, 0);

      handleSelectionShape();
      selectionShape.current.visible = true;

      prevRef.current.x = ex;
      prevRef.current.y = ey;
    }
  }, [handleSelectionShape, pointer.x, pointer.y]);

  useEffect(() => {
    if (!camera) return;
    camera.add(selectionShape.current);
    selectionShape.current.renderOrder = 1;
    selectionShape.current.position.z = -0.1; // Just in front of the camera to avoid culling

  }, [camera]);

  useEffect(() => {
    Emitter.on('POINTER_DOWN', pointerDownListener);
    Emitter.on('POINTER_UP', pointerUpListener);
    Emitter.on('POINTER_MOVE', pointerMoveListener);
    // TODO: Add touch events
    return () => {
      Emitter.off('POINTER_DOWN', pointerDownListener);
      Emitter.off('POINTER_UP', pointerUpListener);
      Emitter.off('POINTER_MOVE', pointerMoveListener);
    };
  }, [
    pointerDownListener, 
    pointerUpListener, 
    pointerMoveListener
  ]);

  return <primitive object={selectionShape.current} />;
};

export default SelectionController;
