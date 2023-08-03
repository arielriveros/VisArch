/* 
Adaptation of https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/selection.js for react-three-fiber.
All credit goes to the original author.
*/

import { useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Vector2, Line, BufferGeometry, LineBasicMaterial, PerspectiveCamera, MathUtils, Float32BufferAttribute } from "three";

export default function LassoSelector() {
    const { gl, scene, camera, pointer } = useThree();
    const [selectionNeedsUpdate, setSelectionNeedsUpdate] = useState<boolean>(false);
    const [selectionShapeNeedsUpdate, setSelectionShapeNeedsUpdate] = useState<boolean>(false);
    const selectionPoints = useRef<number[]>([]);
    const selectionShape = useRef<Line>(new Line(new BufferGeometry()));

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
            //if ( selectionPoints.current.length > 0 )
                //updateSelection();
        }

        const yScale = Math.tan( MathUtils.DEG2RAD * (camera as PerspectiveCamera).fov / 2 ) * selectionShape.current.position.z;
        selectionShape.current.scale.set( -yScale * (camera as PerspectiveCamera).aspect, - yScale, 1 );
    }, [selectionShapeNeedsUpdate]);



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

			/* if ( params.liveUpdate ) 
				selectionNeedsUpdate = true; */
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

    return (
        <primitive object={selectionShape.current} />
     );
}

