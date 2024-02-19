import { useEffect, useRef, useState } from 'react'
import { useTaskContext } from 'features/annotation/hooks/useTask';
import { Canvas, useThree } from '@react-three/fiber';
import { calculateBoundingBox } from 'features/annotation/utils/boundingBox';
import { useProxyMeshContext } from 'features/annotation/hooks/useProxyMesh';
import { Group, Mesh, Vector3 } from 'three';
import { PatternEntity } from 'common/api/ModelTypes';
import CheckboxInput from 'common/components/input/CheckboxInput';
import RangeInput from 'common/components/input/RangeInput';
import useTaskDispatcher from 'features/taskDispatcher';
import SelectionHighlightMesh from '../annotation/highlightMesh/SelectionHighlightMesh';


function CameraComponent(props: {centroid: Vector3, normal: Vector3}) {
    const { camera } = useThree();
    useEffect(() => {
        const position = new Vector3(props.centroid.x, props.centroid.y, props.centroid.z);
        position.add(props.normal);
        position.multiplyScalar(2);
        camera.position.set(position.x, position.y, position.z);
        camera.lookAt(props.centroid);
        camera.zoom = 200;

    }, [props.centroid, props.normal]);
    return null
}

function PropertyPreview(props: {centroid: Vector3, normal: Vector3}) {
    const { selectedArchetype, selectedEntity, task } = useTaskContext();
    const { proxyGeometry, proxyMaterial } = useProxyMeshContext();
    const pivot = useRef<Group | null>(null)
    const archetypeGroup = useRef<Group | null>(null)
    const [archetypeCentroid, setArchetypeCentroid] = useState<Vector3>(new Vector3());
    const [archetypeNormal, setArchetypeNormal] = useState<Vector3>(new Vector3());
    const [archetypeEntity, setArchetypeEntity] = useState<PatternEntity | null>(null);

    useEffect(() => {
        pivot.current = new Group();
        if(!proxyMaterial || !proxyGeometry) return;

        const material = proxyMaterial.clone();
        if (material) material.side = 2;

        const propertyEditMesh = new Mesh(proxyGeometry.clone(), material);
        propertyEditMesh.name = 'propertyEditMesh';

        archetypeGroup.current = new Group();
        const archetypeMesh = new Mesh(proxyGeometry.clone(), material);
        archetypeMesh.name = 'archetypeMesh';
        archetypeGroup.current.add(archetypeMesh);
    }, []);

    useEffect(() => {
        console.log(task);
        if(!proxyGeometry) return;
        selectedArchetype?.entities.forEach(entity => {
			// find the entity which isArchetype is true
			if(entity.isArchetype) {
				const calcBox = calculateBoundingBox(entity?.faceIds, proxyGeometry);
				setArchetypeCentroid(new Vector3(calcBox.centroid.x, calcBox.centroid.y, calcBox.centroid.z));
                setArchetypeNormal(new Vector3(calcBox.centroidNormal.x, calcBox.centroidNormal.y, calcBox.centroidNormal.z));
                setArchetypeEntity(entity);
                console.log('Archetype changed')
			}
		});
    }, [task]);
    
    return (
        <Canvas orthographic={true} >
            <ambientLight />
            <CameraComponent centroid={archetypeCentroid} normal={archetypeNormal} />
            {archetypeGroup.current && <primitive object={archetypeGroup.current}/>}
            {proxyGeometry && archetypeEntity && <SelectionHighlightMesh
                geometry={proxyGeometry}
                toHighlight={archetypeEntity}
                pulse={false}
                color={'#ff00ff'}
                wireframe={false}
            />}
            <directionalLight position={[0, 10, 0]} intensity={1} />
        </Canvas>
    )
}

interface EntityEditorProps {
    orientation: number;
    scale: number;
    reflection: boolean;
}

export default function EntityPropertiesEditor() {
    const { selectedArchetype, selectedEntity } = useTaskContext();
    const {unwrappedGeometry} = useProxyMeshContext();
    const DISPATCH = useTaskDispatcher();
    const [properties, setProperties] = useState<EntityEditorProps>({orientation: 0, scale: 1, reflection: false});
    const [centroid, setCentroid] = useState({x: 0, y: 0, z: 0});
    const [centroidNormal, setCentroidNormal] = useState({x: 0, y: 0, z: 1});

    useEffect(() => {
        if (!selectedEntity) return;
        setProperties({
            orientation: selectedEntity.orientation,
            scale: selectedEntity.scale,
            reflection: selectedEntity.reflection
        });

        if (!unwrappedGeometry) return;
        let result = calculateBoundingBox(selectedEntity.faceIds, unwrappedGeometry);
        setCentroid(result.centroid);
        setCentroidNormal(result.centroidNormal);
        
    }, [selectedEntity]);

    const onSave = () => {
        if (!selectedArchetype || !selectedEntity) return;
        DISPATCH.UPDATE_PATTERN_ENTITY_PROPERTIES(selectedArchetype.nameId, selectedEntity.nameId, properties, true);
    }
    
    return (
        <div className='entity-editor'>
            <RangeInput
                label='Orientation'
                targetName={'orientation'}
                min={0}
                max={360}
                step={0.1}
                value={properties.orientation}
                handleInput={e => setProperties({...properties, orientation: parseInt(e.target.value)})}
                mouseUp={()=>onSave()}
            />
            <RangeInput
                label='Scale'
                targetName={'scale'}
                min={0}
                max={1.5}
                step={0.01}
                value={properties.scale}
                handleInput={e => setProperties({...properties, scale: parseFloat(e.target.value)})}
                mouseUp={()=>onSave()}
            />
            <CheckboxInput  
                label='Reflection'
                targetName={'reflection'}
                value={properties.reflection}
                handleInput={e => {
                    setProperties({...properties, reflection: e.target.checked});
                    onSave();
                }}
            />
            <PropertyPreview centroid={new Vector3(centroid.x, centroid.y, centroid.z)} normal={new Vector3(centroidNormal.x, centroidNormal.y, centroidNormal.z)}/>
        </div>
    )
}
