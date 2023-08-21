import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Group, Material, Mesh, MeshBasicMaterial } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useTaskContext } from '../../../hooks/useTask';
import { useIndicesContext } from '../../../hooks/useIndices';
import { highlightIndices } from '../../../utils/highlightIndices';
import { createHighlightMesh } from '../../../utils/createHighlightMesh';
import CameraController from './CameraController';
import HoverIndex from './HoverIndex';
import LassoSelector from './LassoSelector';
import Confirmation from '../../../components/confirmation/Confirmation';
import './AnnotationController.css';

export default function AnnotationController() {
    const { task, selectedArchetype, loading, dispatch: dispatchTask } = useTaskContext();
    const { proxyGeometry, proxyMaterial, unwrappedGeometry } = useProxyMeshContext();
    const { selectedIndices, dispatch: dispatchIndices } = useIndicesContext();
    const [unwrappedMesh, setUnwrappedMesh] = useState<Mesh>(new Mesh());
    const [selectionHighlightMesh, setSelectionHighlightMesh] = useState<Mesh>(new Mesh());
    const [patternHighlightMeshes, setPatternHighlightMeshes] = useState<{name: string, mesh: Mesh}[]>([]);
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

        const highlightMesh = createHighlightMesh(unwrappedProxyMesh, 'red');
        setSelectionHighlightMesh(highlightMesh);
        groupRef.current?.add(highlightMesh);

        updateHighlightMeshes();
        updateHighlightMeshesIndices();
    }
    
    const disposeMesh = () => {
        unwrappedMesh?.traverse((obj) => {
            if (obj instanceof Mesh) {
                obj.geometry.disposeBoundsTree();
                obj.geometry.dispose();
                obj.material.dispose();
            }
        });
        selectionHighlightMesh?.geometry.disposeBoundsTree();
        selectionHighlightMesh?.geometry.dispose();

        for (let tempHighlightMesh of patternHighlightMeshes) {
            tempHighlightMesh.mesh.geometry.disposeBoundsTree();
            tempHighlightMesh.mesh.geometry.dispose();
        }
    }

    const onConfirm = () => {
        setShowConfirmation(false);
        dispatchTask({ type: 'ADD_PATTERN_ENTITY', payload: { patternIndices: selectedIndices } });
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

    const updateHighlightMeshes = () => {
        for (let tempHighlightMesh of patternHighlightMeshes) {
            if (!task?.annotations?.find(archetype => archetype.nameId === tempHighlightMesh.name)) {
                groupRef.current?.remove(tempHighlightMesh.mesh);
                setPatternHighlightMeshes(patternHighlightMeshes.filter(mesh => mesh.name !== tempHighlightMesh.name));
            }
        }

        for (let archetype of task?.annotations ?? []) {
            const highlightMesh = {
                name: archetype.nameId,
                mesh: createHighlightMesh(unwrappedMesh, archetype.color)
            };
            setPatternHighlightMeshes([...patternHighlightMeshes, highlightMesh]);
            groupRef.current?.add(highlightMesh.mesh);
        }
    }

    const updateHighlightMeshesIndices = () => {
        for (let archetype of task?.annotations ?? []) {
			const meshToHighlight = patternHighlightMeshes.find(mesh => mesh.name === archetype.nameId)?.mesh;
			if (!meshToHighlight) continue;

			let hexColor = archetype.color.padStart(6, '0');
			(meshToHighlight.material as MeshBasicMaterial).color.set(hexColor)

			const patternIndices = archetype.entities.flatMap(entity => entity.faceIds);
			highlightIndices(unwrappedMesh, meshToHighlight, patternIndices);
		}
    }

    useEffect(() => {
        if (!selectedIndices) return;

        highlightIndices(unwrappedMesh, selectionHighlightMesh, selectedIndices);
    }, [selectedIndices]);


    useEffect(() => {
        if(loading) return;
        init();
        setShowConfirmation(false);
        return () => {
            disposeMesh()
            setPatternHighlightMeshes([]);
        };
    }, [proxyGeometry, proxyMaterial]);


    useEffect(() => {
        if(!task) return;
        updateHighlightMeshesIndices();
    }, [task?.annotations]);

    useEffect(() => {
        if(!task) return;
        updateHighlightMeshes();
    }, [task?.annotations?.length]);


	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 2] }}>
				<CameraController />
                <HoverIndex rate={0} />
                <LassoSelector
                    mesh={unwrappedMesh as Mesh}
                    handleOnSelect={ (!showConfirmation) && selectedArchetype ? indicesSelectHandler : ()=>{}}
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
