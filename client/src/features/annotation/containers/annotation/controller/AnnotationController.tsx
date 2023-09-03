import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Group, Material, Mesh } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useTaskContext } from '../../../hooks/useTask';
import { useIndicesContext } from '../../../hooks/useIndices';
import { calculateBoundingBox } from '../../../utils/boundingBox';
import CameraController from './CameraController';
import HoverIndex from './HoverIndex';
import LassoSelector from './LassoSelector';
import Confirmation from '../../../components/confirmation/Confirmation';
import HighlightMesh from '../highlightMesh/HighlightMesh';
import SelectionHighlightMesh from '../highlightMesh/SelectionHighlightMesh';
import DebugGroup from './debugGroup/DebugGroup';
import './AnnotationController.css';

const DEBUG = false;

export default function AnnotationController() {
    const { task, selectedArchetype, loading, dispatch: dispatchTask } = useTaskContext();
    const { proxyGeometry, proxyMaterial, unwrappedGeometry } = useProxyMeshContext();
    const { selectedIndices, dispatch: dispatchIndices } = useIndicesContext();
    const [unwrappedMesh, setUnwrappedMesh] = useState<Mesh>(new Mesh());
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    
    const groupRef = useRef<Group | null>(null);

    const init = () => {
        groupRef.current = new Group();
        if(!proxyGeometry || !proxyMaterial || !unwrappedGeometry) return;

        const material: Material = proxyMaterial.clone();
        if (material) material.side = 0;
        const unwrappedProxyMesh = new Mesh(unwrappedGeometry, material);

        setUnwrappedMesh(unwrappedProxyMesh);
        groupRef.current?.add(unwrappedProxyMesh);
    }
    
    const disposeMesh = () => {
        unwrappedMesh?.traverse((obj) => {
            if (obj instanceof Mesh) {
                obj.geometry.disposeBoundsTree();
                obj.geometry.dispose();
                obj.material.dispose();
            }
        });
    }

    const onConfirm = () => {
        setShowConfirmation(false);
        let bb = calculateBoundingBox(selectedIndices, unwrappedGeometry);
        if (!bb) return;
        dispatchTask({
            type: 'ADD_PATTERN_ENTITY',
            payload: {
                patternIndices: selectedIndices,
                centroid: bb.centroid,
                box: bb.boundingBox
            }
        });
        dispatchIndices({ type: 'SET_SELECTED_INDICES', payload: [] });
    }

    const onCancel = () => {
        setShowConfirmation(false);
        dispatchIndices({ type: 'SET_SELECTED_INDICES', payload: [] });
    }
        
    const indicesSelectHandler = (indices: number[]) => {
        if (indices.length < 3) return;
        setShowConfirmation(true);
        dispatchIndices({ type: 'SET_SELECTED_INDICES', payload: indices });
    }

    useEffect(() => {
        if(loading) return;
        init();
        setShowConfirmation(false);
        return () => {
            disposeMesh()
        };
    }, [proxyGeometry, proxyMaterial]);

	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 2] }}>
				<CameraController />
                <HoverIndex 
                    rate={0} 
                    mesh={unwrappedMesh as Mesh}
                />
                <LassoSelector
                    mesh={unwrappedMesh as Mesh}
                    handleOnSelect={ (!showConfirmation) && selectedArchetype ? indicesSelectHandler : ()=>{}}
                />
				<ambientLight />
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
                {groupRef.current && <primitive object={groupRef.current} />}
                {unwrappedGeometry &&
                    <>
                        <SelectionHighlightMesh geometry={unwrappedGeometry} color={'red'} wireframe={DEBUG}/>
                        { 
                        task?.annotations?.map(archetype => 
                            <HighlightMesh key={archetype.nameId} name={archetype.nameId} geometry={unwrappedGeometry} color={archetype.color} />
                        )}
                    </>
                }
                <DebugGroup debug={DEBUG} bvhMesh={unwrappedMesh} showMonitor={true}/>
                
			</Canvas>
            {showConfirmation && <Confirmation label={"Add Pattern?"} onConfirm={onConfirm} onCancel={onCancel} />}
		</div>
	);
}
