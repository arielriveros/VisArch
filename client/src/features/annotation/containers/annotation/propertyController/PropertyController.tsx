import { Canvas } from '@react-three/fiber';
import { Group, Mesh, Vector3 } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useEffect, useRef, useState } from 'react';
import { calculateBoundingBox } from '../../../utils/boundingBox';
import { useTaskContext } from '../../../hooks/useTask';
import { EffectComposer, BrightnessContrast, Bloom, HueSaturation } from '@react-three/postprocessing'
import './PropertyController.css';

type PropertyControllerProps = {
}

export default function PropertyController(props: PropertyControllerProps) {
	const { selectedArchetype, selectedEntity, dispatch: dispatchTask } = useTaskContext();
	const { proxyGeometry, unwrappedGeometry, proxyMaterial } = useProxyMeshContext();
	const [centroid, setCentroid] = useState<Vector3>(new Vector3());
	const [archetypeCentroid, setArchetypeCentroid] = useState<Vector3>(new Vector3());
	const [properties, setProperties] = useState<{orientation: number, scale: number, reflection: boolean, isArchetype: boolean}>({
		orientation: selectedEntity!.orientation,
		scale: selectedEntity!.scale,
		reflection: selectedEntity!.reflection,
		isArchetype: selectedEntity!.isArchetype
	});
	const [overlap, setOverlap] = useState<boolean>(false);
	const pivot = useRef<Group | null>(null)
	const archetypeGroup = useRef<Group | null>(null)

	useEffect(() => {
		pivot.current = new Group();
        if(!proxyMaterial || !unwrappedGeometry) return;

        const material = proxyMaterial.clone();
        if (material) material.side = 0;
	
        const propertyEditMesh = new Mesh(unwrappedGeometry.clone(), material);
		propertyEditMesh.name = 'propertyEditMesh';

		if (!selectedEntity) return;
		const entityIndices = selectedEntity.faceIds;

		let newIndices: number[] = [];
        for (let i = 0; i < entityIndices.length; i++) {
            const index = entityIndices[i] * 3;
            const a = index + 0;
            const b = index + 1;
            const c = index + 2;
            newIndices.push(a, b, c);
        }

		const indexAttr = unwrappedGeometry.index;
		const newIndexAttr = propertyEditMesh.geometry.index;
		// update the highlight mesh
		for ( let i = 0, l = newIndices.length; i < l; i ++ ) {
			const ix = indexAttr?.getX( newIndices[i] );
			newIndexAttr?.setX( i, ix as number );
		}

		propertyEditMesh.geometry.drawRange.count = newIndices.length;
		if (newIndexAttr)
			newIndexAttr.needsUpdate = true;

        pivot.current?.add(propertyEditMesh);

		archetypeGroup.current = new Group();
		const archetypeMesh = new Mesh(unwrappedGeometry.clone(), material.clone());
		archetypeMesh.name = 'archetypeMesh';

        archetypeGroup.current?.add(archetypeMesh);
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
		pivot.current?.getObjectByName('propertyEditMesh')?.position.set(-calcBox.centroid.x, -calcBox.centroid.y, 0);

		// Rotate the pivot point
		pivot.current?.rotation.set(0, 0, properties.orientation * Math.PI / 180);

		// Scale the pivot point
		pivot.current?.scale.set(properties.scale * (properties.reflection ? -1 : 1), properties.scale, properties.scale);

	}, [selectedEntity, properties]);

	useEffect(() => {
		if(!unwrappedGeometry) return;
		selectedArchetype?.entities.forEach(entity => {
			// find the entity which isArchetype is true
			if(entity.isArchetype) {
				const calcBox = calculateBoundingBox(entity?.faceIds, unwrappedGeometry);
				const meanDistance = (
					calcBox.boundingBox.max.x - calcBox.boundingBox.min.x + 
					calcBox.boundingBox.max.y - calcBox.boundingBox.min.y
					) / 2;

				setArchetypeCentroid(new Vector3(calcBox.centroid.x, calcBox.centroid.y, calcBox.centroid.z + meanDistance));
				archetypeGroup.current?.position.set(-calcBox.centroid.x, -calcBox.centroid.y, 0);
			}
		}
		);
	}
	, [selectedArchetype?.entities]);

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
				<div className={overlap ? 'canvas-windows-overlapped' : 'canvas-windows'}>
					<div className={'archetype-canvas'}>
						<Canvas camera={{
							position: [0, 0, archetypeCentroid.z],
							near: 0.001,
							fov: 90 }}>
							<ambientLight />
							<directionalLight position={[0, 10, 0]} intensity={1} />
							{archetypeGroup.current && <primitive object={archetypeGroup.current}/>}
							{overlap && 
							<EffectComposer>
								<HueSaturation hue={0.2} saturation={0.15} />
								<BrightnessContrast brightness={0.35} contrast={0.55} />
							</EffectComposer>}
						</Canvas>
					</div>

					{!properties.isArchetype &&
					<>
					<div className='property-canvas'>
						<Canvas camera={{
							position: [0, 0, centroid.z],
							near: 0.001,
							fov: 90 }}>
							<ambientLight />
							<directionalLight position={[0, 10, 0]} intensity={1} />
							{pivot.current && <primitive object={pivot.current}/>}
							{overlap &&
							<EffectComposer>
								<BrightnessContrast brightness={0.35} contrast={0.55} />
							</EffectComposer>
							}
						</Canvas>
					</div>
					</>
					}
				</div>
				<div className='property-editor'>
					{
						!properties.isArchetype && // Only edit properties if the entity is not an archetype
						<>
						<label>Orientation</label>
						<input type="range" min="0" max="360" value={properties.orientation} onChange={(e) => setProperties({...properties, orientation: parseInt(e.target.value)})}/>
						<label>Scale</label>
						<input type="range" min="0" max="1.5" step="0.01" value={properties.scale} onChange={(e) => setProperties({...properties, scale: parseFloat(e.target.value)})}/>
						<label>Reflection</label>
						<input type="checkbox" checked={properties.reflection} onChange={(e) => setProperties({...properties, reflection: e.target.checked})}/>
						</>
					}
					<div>
						<label>Overlap</label>
						<input type="checkbox" checked={overlap} onChange={(e) => setOverlap(e.target.checked)}/>
						<button onClick={onDelete}>Delete</button>
						<button onClick={onClose}>Close</button>
					</div>
				</div>
			</div>
		</div>
	)
}
