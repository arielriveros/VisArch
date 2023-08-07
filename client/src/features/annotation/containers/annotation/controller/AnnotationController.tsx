import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { BufferAttribute, ColorRepresentation, Group, Material, Mesh, MeshBasicMaterial } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useTaskContext } from '../../../hooks/useTask';
import { useIndicesContext } from '../../../hooks/useIndices';
import { radialUnwrap } from '../../../utils/radialUnwrap';
import { flattenAxis } from '../../../utils/flattenAxis';
import { highlightIndices } from '../../../utils/highlightIndices';
import CameraController from './CameraController';
import HoverIndex from './HoverIndex';
import LassoSelector from './LassoSelector';
import Confirmation from '../../../components/confirmation/Confirmation';
import './AnnotationController.css';

export default function AnnotationController() {
    const { selectedArchetype: archetype,  dispatch: dispatchTask } = useTaskContext();
    const { proxyGeometry, proxyMaterial } = useProxyMeshContext();
    const { selectedIndices, dispatch: dispatchIndices } = useIndicesContext();
    const [unwrappedMesh, setUnwrappedMesh] = useState<Mesh>(new Mesh());
    const [highlightMesh, setHighlightMesh] = useState<Mesh>(new Mesh());
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    
    const groupRef = useRef<Group | null>(null);

    const init = async () => {
        groupRef.current = new Group();
        const unwrappedProxyMesh = await unwrapMesh('y');
        if (!unwrappedProxyMesh) return;

        setUnwrappedMesh(unwrappedProxyMesh);
        groupRef.current?.add(unwrappedProxyMesh);

        const highlightMesh = createHighlightMesh(unwrappedProxyMesh, 'red');
        setHighlightMesh(highlightMesh);
        groupRef.current?.add(highlightMesh);
    }

    const unwrapMesh = async (unwrapAxis: 'x' | 'y' | 'z') => {
        return new Promise<Mesh | null>((resolve) => {
            if (!proxyGeometry || !proxyMaterial) {
                resolve(null);
                return;
            }

            const material: Material = proxyMaterial.clone();
            if (material) material.side = 0;

            const unwrappedProxyMesh = new Mesh();
            unwrappedProxyMesh.geometry = proxyGeometry.clone();
            unwrappedProxyMesh.material = material;
            const unwrappedPositionsNotFlattened = radialUnwrap(
                Array.from(proxyGeometry.attributes.position.array),
                unwrapAxis
            );
            const unwrappedPositions = flattenAxis(unwrappedPositionsNotFlattened, 'x', 0.05);
            const positionsBufferAttribute = new BufferAttribute(new Float32Array(unwrappedPositions), 3);

            unwrappedProxyMesh.geometry.setAttribute('position', positionsBufferAttribute);

            unwrappedProxyMesh.geometry.rotateX(Math.PI / 2);
            unwrappedProxyMesh.geometry.rotateY(-Math.PI / 2);
            unwrappedProxyMesh.geometry.translate(0, 2, 0);

            unwrappedProxyMesh.geometry.computeBoundsTree();
            unwrappedProxyMesh.geometry.computeVertexNormals();
            unwrappedProxyMesh.geometry.computeTangents();

            resolve(unwrappedProxyMesh);
        });
    };
    
    const createHighlightMesh = (originalMesh: Mesh, color: ColorRepresentation = 0xff9800) => {
        const highlightMesh = new Mesh();
        highlightMesh.geometry = originalMesh.geometry.clone();
        highlightMesh.geometry.drawRange.count = 0;
        highlightMesh.material = new MeshBasicMaterial({
            opacity: 0.5,
            color: color,
            depthWrite: false,
            transparent: true,
            
        });
        highlightMesh.renderOrder = 1;
        
        return highlightMesh;
    }

    const disposeMesh = () => {
        unwrappedMesh?.traverse((obj) => {
            if (obj instanceof Mesh) {
                obj.geometry.disposeBoundsTree();
                obj.geometry.dispose();
                obj.material.dispose();
            }
        });
        highlightMesh?.geometry.disposeBoundsTree();
        highlightMesh?.geometry.dispose();
    }

    const onConfirm = () => {
        setShowConfirmation(false);
        dispatchTask({ type: 'ADD_PATTERN_ENTITY', payload: { patternIndices: selectedIndices } });
    }

    const onCancel = () => {
        setShowConfirmation(false);
        highlightIndices(unwrappedMesh, highlightMesh, []);
        dispatchIndices({ type: 'SET_SELECTED_INDICES', payload: [] });
    }
        
    const indicesSelectHandler = (indices: number[]) => {
        if (indices.length < 3) return;

        highlightIndices(unwrappedMesh, highlightMesh, indices);
        setShowConfirmation(true);
        dispatchIndices({ type: 'SET_SELECTED_INDICES', payload: indices });
    }

    useEffect(() => {
        init();
        setShowConfirmation(false);
        return () => disposeMesh();
    }, [proxyGeometry, proxyMaterial]);


	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 2] }}>
				<CameraController />
                <HoverIndex rate={0} />
                <LassoSelector
                    mesh={unwrappedMesh as Mesh}
                    handleOnSelect={ (!showConfirmation) && archetype ? indicesSelectHandler : ()=>{}}
                />
				<ambientLight />
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
                {groupRef.current && <primitive object={groupRef.current} />}
			</Canvas>
            {showConfirmation && <Confirmation label={"Add Pattern?"} onConfirm={onConfirm} onCancel={onCancel} />}
		</div>
	);
}
