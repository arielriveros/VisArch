import { Canvas, useThree } from '@react-three/fiber';
import { IntersectionPayload, ProxyMeshProperties } from '../../containers/annotation/manager/AnnotationManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './AnnotationViewer.css';
import { useEffect } from 'react';
import { Vector3 } from 'three';

interface AnnotationViewerProps extends ProxyMeshProperties {
	selectedIndex: IntersectionPayload | null;
}

function LookAtIndex(props: { selectedIndex: IntersectionPayload | null }) {
	const { camera } = useThree();

	useEffect(() => {
		if (!props.selectedIndex) return;

		const position = new Vector3();
		console.log(props.selectedIndex);
		

	} , [props.selectedIndex, camera]);

	return null;
}


export default function AnnotationViewer(props: AnnotationViewerProps) {

	const { geometry, material, selectedIndex } = props;

	return (
		<div className="small-canvas">
			<Canvas camera={{ position: [0, 0, 2] }}>
				<LookAtIndex selectedIndex={selectedIndex} />
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{geometry && <mesh geometry={geometry} material={material} />}
			</Canvas>
		</div>
	);
}
