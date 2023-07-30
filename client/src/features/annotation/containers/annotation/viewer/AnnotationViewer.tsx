import { Canvas, useThree } from '@react-three/fiber';
import './AnnotationViewer.css';
import { ProxyMeshProperties } from '../manager/AnnotationManager';
import { BufferAttribute, BufferGeometry, NormalBufferAttributes } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect } from 'react';

function CameraController() {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);  
        controls.enablePan = false;
        controls.enableZoom = false;

        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    
    return null;
}

interface AnnotationViewerProps extends ProxyMeshProperties {}

export default function AnnotationViewer(props: AnnotationViewerProps) {

	const { geometry, material } = props;

	const cylindricalUnwrapGeometry = (inGeometry: BufferGeometry<NormalBufferAttributes>) => {
		/* This needs to be changed to the correct way to unwrap */
		const clonedGeometry = inGeometry.clone();

		const positions = Array.from(clonedGeometry.attributes.position.array) as number[];
		const normals = Array.from(clonedGeometry.attributes.normal.array) as number[];
		const uvs = Array.from(clonedGeometry.attributes.uv.array) as number[];

		const newPositions: number[] = [];
		const newNormals: number[] = [];
		const newUvs: number[] = [];

		const projection_radius: number = 1.0;
		const ax1 = 0, ax2 = 2;

		let accum_radius: number = 0;
		let point_radius: number = 0;

		for (let i = 0; i < positions.length; i += 3) {
			point_radius = Math.sqrt(positions[ax1]*positions[ax1] + positions[ax2]*positions[ax2]);

			/// add point radius to accumulated radius
			accum_radius += point_radius;
			let x = positions[i];
			let y = positions[i + 1];
			let z = positions[i + 2];
			x = x*projection_radius/point_radius;
			z = z*projection_radius/point_radius;

			const u = uvs[i];
			const v = uvs[i + 1];

			let nx = normals[i];
			nx *= projection_radius/point_radius;
			const ny = normals[i + 1];
			let nz = normals[i + 2];
			nz *= projection_radius/point_radius;

			newPositions.push(x, y, z);
			newNormals.push(nx, ny, nz);
			newUvs.push(u, v);
		}

		clonedGeometry.setAttribute('position', new BufferAttribute(new Float32Array(newPositions), 3));
		clonedGeometry.setAttribute('normal', new BufferAttribute(new Float32Array(newNormals), 3));
		clonedGeometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));

		return clonedGeometry;
	}

	return (
		<>
			<div className='annotation-controller-container'>
				<Canvas camera={{position: [0, 0, 5]}} >
					<CameraController />
					<ambientLight />
					<color attach="background" args={['gray']} />
					<pointLight position={[10, 10, 10]} />
					{
						geometry && (
							<mesh geometry={cylindricalUnwrapGeometry(geometry)} material={material} />
						)
					}
				</Canvas>
			</div>
			<div className='annotation-viewer-container'>
				<Canvas camera={{position: [0, 1, 1]}} >
					<ambientLight />
					<color attach="background" args={['black']} />
					<pointLight position={[10, 10, 10]} />
					<mesh geometry={geometry} material={material} />
				</Canvas>
			</div>
		</>
	)
}
