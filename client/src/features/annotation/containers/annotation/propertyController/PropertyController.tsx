import { Canvas } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import Confirmation from '../../../components/confirmation/Confirmation'
import './PropertyController.css';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useEffect, useRef, useState } from 'react';
import { calculateBoundingBox } from '../../../utils/boundingBox';
import { useTaskContext } from '../../../hooks/useTask';

type PropertyControllerProps = {
	mesh: Mesh;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function PropertyController(props: PropertyControllerProps) {
	const { selectedIndices } = useTaskContext();
	const { proxyGeometry, unwrappedGeometry } = useProxyMeshContext();
	const [cameraPosition, setCameraPosition] = useState<{pos: Vector3, lookAt: Vector3}>(
			{pos: new Vector3(0, 0, 0), lookAt: new Vector3(0, 0, 0)}
		);

	useEffect(() => {
		if(!proxyGeometry || !unwrappedGeometry) return;

		const calcBox = calculateBoundingBox(selectedIndices, unwrappedGeometry);
		const meanDistance = (
			calcBox.boundingBox.max.x - calcBox.boundingBox.min.x + 
			calcBox.boundingBox.max.y - calcBox.boundingBox.min.y +
			calcBox.boundingBox.max.z
			) / 2;

		setCameraPosition({
			pos: new Vector3(calcBox.centroid.x, calcBox.centroid.y, meanDistance),
			lookAt: calcBox.centroid
		});


	}, [proxyGeometry, unwrappedGeometry]);



  	return (
		<div className='property-container'>
			<div className='property-window'>
				<div className='property-canvas'>
					<Canvas camera={{
							position: cameraPosition.pos,
							lookAt: () => cameraPosition.lookAt,
							near: 0.001
						}}
							frameloop={'demand'}
						>
						<ambientLight />
						<pointLight position={[10, 10, 10]} />
						<directionalLight position={[0, 10, 0]} intensity={1} />
						<mesh geometry={props.mesh.geometry} material={props.mesh.material} />
					</Canvas>
				</div>
				<Confirmation label={"Add Pattern?"} onConfirm={props.onConfirm} onCancel={props.onCancel} />
			</div>
		</div>
	)
}
