import { Canvas, useThree } from '@react-three/fiber';
import { IntersectionPayload } from '../../containers/annotation/manager/AnnotationManager';
import { useEffect } from 'react';
import { Vector3 } from 'three';
import { useProxyMeshContext } from '../../hooks/useProxyMesh';
import CrossHairs from './CrossHairs';
import './AnnotationViewer.css';

interface AnnotationViewerProps {
	selectedIndex: IntersectionPayload | null;
}

function LookAtIndex(props: { selectedIndex: IntersectionPayload | null }) {
	const { camera } = useThree();
	const { proxyMesh } = useProxyMeshContext();

	const getPosition = (face: {a: number, b: number, c: number, normal: Vector3}) => {
		const { a, b, c } = face;
		const geometry = proxyMesh?.geometry;
		if (!geometry) return null;

		const vertices = geometry.attributes.position.array;
		const x = (vertices[a * 3] + vertices[b * 3] + vertices[c * 3]) / 3;
		const y = (vertices[a * 3 + 1] + vertices[b * 3 + 1] + vertices[c * 3 + 1]) / 3;
		const z = (vertices[a * 3 + 2] + vertices[b * 3 + 2] + vertices[c * 3 + 2]) / 3;

		return new Vector3(x, y, z);
	}

	const changeView = (newPosition: Vector3) => {
		camera.position.set(newPosition.x, newPosition.y, newPosition.z);
		camera.position.multiplyScalar(2);
		camera.lookAt(0, 0, 0);
	}

	useEffect(() => {
		if (!props.selectedIndex) return;
		const { face } = props.selectedIndex;
		
		if (!face) return;
		const position = getPosition(face);

		if (position) 
			changeView(position);
	} , [props.selectedIndex, camera]);

	return null;
}


export default function AnnotationViewer(props: AnnotationViewerProps) {

	const { proxyMesh } = useProxyMeshContext();

	return (
		<div className="small-canvas">
			<CrossHairs resolution={50}/>
			<Canvas camera={{ position: [0, 0, 2] }}>
				<LookAtIndex selectedIndex={props.selectedIndex} />
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{proxyMesh?.geometry && <mesh geometry={proxyMesh.geometry} material={proxyMesh.material} />}
			</Canvas>
		</div>
	);
}
