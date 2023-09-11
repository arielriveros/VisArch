import { Canvas } from '@react-three/fiber';
import { Group, Matrix4, Mesh, Vector3 } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useEffect, useRef, useState } from 'react';
import { calculateBoundingBox } from '../../../utils/boundingBox';
import { useTaskContext } from '../../../hooks/useTask';
import './PropertyController.css';

type PropertyControllerProps = {
}

export default function PropertyController(props: PropertyControllerProps) {
	const { selectedArchetype, selectedEntity, dispatch: dispatchTask } = useTaskContext();
	const { proxyGeometry, unwrappedGeometry, proxyMaterial } = useProxyMeshContext();
	const [centroid, setCentroid] = useState<Vector3>(new Vector3());
	const [properties, setProperties] = useState<{orientation: number, scale: number, reflection: boolean}>({
		orientation: selectedEntity!.orientation,
		scale: selectedEntity!.scale,
		reflection: selectedEntity!.reflection
	});
	const pivot = useRef<Group | null>(null)

	useEffect(() => {
		pivot.current = new Group();
        if(!proxyMaterial || !unwrappedGeometry) return;

        const material = proxyMaterial.clone();
        if (material) material.side = 0;
        const unwrappedProxyMesh = new Mesh(unwrappedGeometry.clone(), material);
		unwrappedProxyMesh.name = 'unwrappedProxyMesh';

        pivot.current?.add(unwrappedProxyMesh);

	}, [proxyMaterial, unwrappedGeometry]);

	useEffect(() => {
		if(!unwrappedGeometry || !selectedEntity) return;

		dispatchTask({ type: 'UPDATE_PATTERN_ENTITY_PROPERTIES', payload: {
			patternArchetypeName: selectedArchetype!.nameId,
			patternEntityName: selectedEntity!.nameId,
			entityProperties: properties
		}});

		const calcBox = calculateBoundingBox(selectedEntity?.faceIds, unwrappedGeometry);
		const meanDistance = (
			calcBox.boundingBox.max.x - calcBox.boundingBox.min.x + 
			calcBox.boundingBox.max.y - calcBox.boundingBox.min.y
			) / 2;

		setCentroid(new Vector3(calcBox.centroid.x, calcBox.centroid.y, calcBox.centroid.z + meanDistance));

		// Make the pivot point the centroid of the unwrapped geometry
		pivot.current?.getObjectByName('unwrappedProxyMesh')?.position.set(-calcBox.centroid.x, -calcBox.centroid.y, 0);

		// Rotate the pivot point
		pivot.current?.rotation.set(0, 0, properties.orientation * Math.PI / 180);

		// Scale the pivot point
		pivot.current?.scale.set(properties.scale * (properties.reflection ? -1 : 1), properties.scale, properties.scale);

	}, [selectedEntity, properties]);

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
						position: [0, 0, centroid.z],
						near: 0.001,
						fov: 90 }}>
						<ambientLight />
						<directionalLight position={[0, 10, 0]} intensity={1} />
						{pivot.current && <primitive object={pivot.current}/>}
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