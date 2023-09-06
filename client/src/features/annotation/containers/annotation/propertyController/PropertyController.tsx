import { Canvas } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import Confirmation from '../../../components/confirmation/Confirmation'
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useEffect, useState } from 'react';
import { calculateBoundingBox } from '../../../utils/boundingBox';
import { useTaskContext } from '../../../hooks/useTask';
import './PropertyController.css';

type PropertyControllerProps = {
	mesh: Mesh;
}

export default function PropertyController(props: PropertyControllerProps) {
	const { selectedArchetype, selectedEntity, dispatch: dispatchTask } = useTaskContext();
	const { proxyGeometry, unwrappedGeometry } = useProxyMeshContext();
	const [cameraPosition, setCameraPosition] = useState<{pos: Vector3, lookAt: Vector3}>(
		{pos: new Vector3(0, 0, 0), lookAt: new Vector3(0, 0, 0)}
	);
	const [properties, setProperties] = useState<{orientation: number, scale: number, reflection: boolean}>({
		orientation: selectedEntity!.orientation,
		scale: selectedEntity!.scale,
		reflection: selectedEntity!.reflection
	});

	useEffect(() => {
		dispatchTask({ type: 'UPDATE_PATTERN_ENTITY_PROPERTIES', payload: {
			patternArchetypeName: selectedArchetype!.nameId,
			patternEntityName: selectedEntity!.nameId,
			entityProperties: properties
		}});
	}, [properties, selectedEntity]);
		

	useEffect(() => {
		if(!proxyGeometry || !unwrappedGeometry || !selectedEntity) return;

		const calcBox = calculateBoundingBox(selectedEntity?.faceIds, unwrappedGeometry);
		const meanDistance = (
			calcBox.boundingBox.max.x - calcBox.boundingBox.min.x + 
			calcBox.boundingBox.max.y - calcBox.boundingBox.min.y +
			calcBox.boundingBox.max.z
			) / 2;

		setCameraPosition({
			pos: new Vector3(calcBox.centroid.x, calcBox.centroid.y, meanDistance),
			lookAt: calcBox.centroid
		});

	}, [proxyGeometry, unwrappedGeometry, selectedEntity]);

	const onDelete = () => {
		dispatchTask({ type: 'REMOVE_PATTERN_ENTITY', payload: { patternEntityName: selectedEntity!.nameId }});
		onClose();
	}

	const onClose = () => {
		dispatchTask({ type: 'SET_SHOW_PROPERTY_CONTROLLER', payload: false });
	}

  	return (
		<div className='property-container'>
			<div className='property-window'>
				<div className='property-canvas'>
					<Canvas camera={{
							position: cameraPosition.pos,
							lookAt: () => cameraPosition.lookAt,
							near: 0.001
						}}
					>
						<ambientLight />
						<pointLight position={[10, 10, 10]} />
						<directionalLight position={[0, 10, 0]} intensity={1} />
						<mesh geometry={props.mesh.geometry} material={props.mesh.material} />
					</Canvas>
				</div>
				<div className='property-editor'>
					<label>Orientation</label>
					<input type="range" min="0" max="360" value={properties.orientation} onChange={(e) => setProperties({...properties, orientation: parseInt(e.target.value)})}/>
					<label>Scale</label>
					<input type="range" min="0" max="1" step="0.01" value={properties.scale} onChange={(e) => setProperties({...properties, scale: parseFloat(e.target.value)})}/>
					<label>Reflection</label>
					<input type="checkbox" checked={properties.reflection} onChange={(e) => setProperties({...properties, reflection: e.target.checked})}/>
					<div>
						<button onClick={onDelete}>Delete</button>
						<button onClick={onClose}>Close</button>
					</div>
				</div>
			</div>
		</div>
	)
}
