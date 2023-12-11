/* 
Adaptation of https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/selection.js for react-three-fiber.
All credit goes to the original author.
*/

import { useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Vector2, Vector3, Matrix4, Line, Line3, Mesh, PerspectiveCamera, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, MathUtils, Ray, BackSide, FrontSide, DoubleSide } from "three";
import { CONTAINED, INTERSECTED, NOT_INTERSECTED } from "three-mesh-bvh";
import { getConvexHull, lineCrossesLine, pointRayCrossesSegments } from "../../../utils/lassoMath";

type LassoSelectorProps = {
    mesh: Mesh | null;
    handleOnSelect: (indices: number[]) => void;
}

export default function LassoSelector(props: LassoSelectorProps) {
    const { gl, scene, camera, pointer } = useThree();
    const [selectionNeedsUpdate, setSelectionNeedsUpdate] = useState<boolean>(false);
    const [selectionShapeNeedsUpdate, setSelectionShapeNeedsUpdate] = useState<boolean>(false);
    const selectionPoints = useRef<number[]>([]);
    const selectionShape = useRef<Line>(new Line(new BufferGeometry()));
    const selectionIndices = useRef<number[]>([]);

    let prevX = - Infinity;
	let prevY = - Infinity;
    const tempVec0 = new Vector2();
	const tempVec1 = new Vector2();
	const tempVec2 = new Vector2();

    const init = () => {
        scene.add(camera);
        camera.add(selectionShape.current);
        selectionShape.current.renderOrder = 1;
        selectionShape.current.position.z = -0.2;
        selectionShape.current.scale.setScalar( 1 );
        selectionShape.current.material = new LineBasicMaterial({ 
            color: 0xff9800,
            alphaTest: 0.5,
            depthTest: false,
            depthWrite: false,
            toneMapped: false,
            transparent: true,
            linewidth: 1
        });
    }

    const dispose = () => {
        scene.remove(camera);
        camera.remove(selectionShape.current);
        selectionShape.current.geometry.dispose();
    }

    useEffect(() => {
        // Update the selection lasso lines
        if ( selectionShapeNeedsUpdate ) {
            const ogLength = selectionPoints.current.length;
            selectionPoints.current.push( selectionPoints.current[0], selectionPoints.current[1], selectionPoints.current[2]);

            selectionShape.current.geometry.setAttribute(
                'position',
                new Float32BufferAttribute( selectionPoints.current, 3, false )
            );

            selectionPoints.current.length = ogLength;
            selectionShape.current.frustumCulled = false;
            setSelectionShapeNeedsUpdate(false);
        }

        if ( selectionNeedsUpdate ) {
            setSelectionNeedsUpdate(false);
            if ( selectionPoints.current.length > 0 )
                updateSelection();
        }

        const yScale = Math.tan( MathUtils.DEG2RAD * (camera as PerspectiveCamera).fov / 2 ) * selectionShape.current.position.z;
        selectionShape.current.scale.set( -yScale * (camera as PerspectiveCamera).aspect, - yScale, 1 );
    }, [selectionNeedsUpdate, selectionShapeNeedsUpdate]);

    const handlePointerDown = (e: PointerEvent) => {
        prevX = e.clientX;
		prevY = e.clientY;
		selectionPoints.current.length = 0;
    }

    const handlePointerUp = (e: PointerEvent) => {
        selectionShape.current.visible = false;
		if ( selectionPoints.current.length )
            setSelectionNeedsUpdate(true);
    }

    const handlePointerMove = (e: PointerEvent) => {
        // If the left mouse button is not pressed
		if ( ( 1 & e.buttons ) === 0 ) return;
   
		const ex = e.clientX;
		const ey = e.clientY;

		const nx = pointer.x;
		const ny = pointer.y ;

		// If the mouse hasn't moved a lot since the last point
		if ( Math.abs( ex - prevX ) >= 3 || Math.abs( ey - prevY ) >= 3 ) {
			// Check if the mouse moved in roughly the same direction as the previous point
			// and replace it if so.
			const i = ( selectionPoints.current.length / 3 ) - 1;
			const i3 = i * 3;
			let doReplace = false;
			if ( selectionPoints.current.length > 3 ) {
				// prev segment direction
				tempVec0.set( selectionPoints.current[ i3 - 3 ], selectionPoints.current[ i3 - 3 + 1 ] );
				tempVec1.set( selectionPoints.current[ i3 ], selectionPoints.current[ i3 + 1 ] );
				tempVec1.sub( tempVec0 ).normalize();

				// this segment direction
				tempVec0.set( selectionPoints.current[ i3 ], selectionPoints.current[ i3 + 1 ] );
				tempVec2.set( nx, ny );
				tempVec2.sub( tempVec0 ).normalize();

				const dot = tempVec1.dot( tempVec2 );
				doReplace = dot > 0.99;
			}

			if ( doReplace ) {
				selectionPoints.current[i3] = nx;
				selectionPoints.current[i3 + 1] = ny;
			}
			else
				selectionPoints.current.push(nx, ny, 0);

			setSelectionShapeNeedsUpdate(true);
			selectionShape.current.visible = true;

			prevX = ex;
			prevY = ey;
		}
    }

    useEffect(() => {
        init();
        gl.domElement.addEventListener('pointerdown', handlePointerDown);
        gl.domElement.addEventListener('pointerup', handlePointerUp);
        gl.domElement.addEventListener('pointermove', handlePointerMove);
        return () => {
            dispose();
            gl.domElement.removeEventListener('pointerdown', handlePointerDown);
            gl.domElement.removeEventListener('pointerup', handlePointerUp);
            gl.domElement.removeEventListener('pointermove', handlePointerMove);
        }
    } , []);

    const toScreenSpaceMatrix = new Matrix4();
    const lassoSegments: Line3[] = [];
    const invWorldMatrix = new Matrix4();
    const camLocalPosition = new Vector3();
    const tempRay = new Ray();
    const centroid = new Vector3();
    const screenCentroid = new Vector3();
    const faceNormal = new Vector3();
    const boxPoints = new Array(8).fill(0).map(() => new Vector3());
    const boxLines = new Array(12).fill(0).map(() => new Line3());
    const perBoundsSegments: Line3[][] = [];

    const updateSelection = () => {
        if(!props.mesh) return;

        selectionIndices.current = [];
    
        toScreenSpaceMatrix.copy(props.mesh.matrixWorld)
		    .premultiply( camera.matrixWorldInverse )
		    .premultiply( camera.projectionMatrix );

        // create scratch points and lines to use for selection
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

        invWorldMatrix.copy(props.mesh.matrixWorld).invert();
	    camLocalPosition.set(0, 0, 0).applyMatrix4(camera.matrixWorld).applyMatrix4(invWorldMatrix);

        props.mesh.geometry.boundsTree?.shapecast({
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
                const i3 = index * 3;
                const a = i3 + 0;
                const b = i3 + 1;
                const c = i3 + 2;

                // check all the segments if using no bounds tree
                const segmentsToCheck = perBoundsSegments[depth];

                // get the center of the triangle
                centroid.copy(tri.a).add(tri.b).add(tri.c).multiplyScalar(1/3);
                screenCentroid.copy(centroid).applyMatrix4(toScreenSpaceMatrix);

                // counting the crossings
                if (contained || pointRayCrossesSegments( screenCentroid, segmentsToCheck ) % 2 === 1) {
                    tri.getNormal( faceNormal );
                    tempRay.origin.copy( centroid ).addScaledVector( faceNormal, 1e-6 );
                    tempRay.direction.subVectors( camLocalPosition, centroid );

                    const res = props.mesh?.geometry.boundsTree?.raycastFirst(tempRay, BackSide);
                    if (res) return false;

                    selectionIndices.current.push( index );
                    return false;
                }

                return false;
            }
        });
        props.handleOnSelect(selectionIndices.current);
    }

    return (
        <primitive object={selectionShape.current} />
     );
}

