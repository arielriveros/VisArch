import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, Mesh, MeshBasicMaterial } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useIndicesContext } from '../../../hooks/useIndices';
import { useTaskContext } from '../../../hooks/useTask';
import { highlightIndices } from '../../../utils/highlightIndices';
import { createHighlightMesh } from '../../../utils/createHighlightMesh';
import CrossHairs from './CrossHairs';
import LookAtIndex from './LookAtIndex';
import './AnnotationViewer.css';

export default function AnnotationViewer() {
	const { task, selectedArchetype} = useTaskContext();
	const { proxyGeometry, proxyMaterial } = useProxyMeshContext();
	const { selectedIndices } = useIndicesContext();
	const [originalMesh, setOriginalMesh] = useState<Mesh>(new Mesh());
	const [selectionHighlightMesh, setSelectionHighlightMesh] = useState<Mesh>(new Mesh());
	const [patternHighlightMeshes, setPatternHighlightMeshes] = useState<{name: string, mesh: Mesh}[]>([]);

	const groupRef = useRef<Group | null>(null);

	const init = () => {
		groupRef.current = new Group();

		if(!proxyGeometry || !proxyMaterial) return;

        const originalMesh = new Mesh();
		originalMesh.geometry = proxyGeometry.clone();
		originalMesh.material = proxyMaterial.clone();

        setOriginalMesh(originalMesh);
        groupRef.current?.add(originalMesh);

        const highlightMesh = createHighlightMesh(originalMesh, 'violet');
        setSelectionHighlightMesh(highlightMesh);
        groupRef.current?.add(highlightMesh);

		updateHighlightMeshes(false);
	}

	const dispose = () => {
		if (!groupRef.current) return;

		for (let child of groupRef.current.children)  {
			(child as Mesh).geometry.dispose();
			groupRef.current.remove(child);
		}

		selectionHighlightMesh.geometry.dispose();
		groupRef.current.remove(selectionHighlightMesh);

		for (let tempHighlightMesh of patternHighlightMeshes) {
			tempHighlightMesh.mesh.geometry.disposeBoundsTree();
            tempHighlightMesh.mesh.geometry.dispose();
			groupRef.current.remove(tempHighlightMesh.mesh);
        }
	}

	const updateHighlightMeshes = (updateEntitiesOnly: boolean) => {
        if(!updateEntitiesOnly) {
            for (let archetype of task?.annotations ?? []) {
                const highlightMesh = {
                    name: archetype.nameId,
                    mesh:createHighlightMesh(originalMesh, Math.random() * 0xffffff)
                };
                setPatternHighlightMeshes([...patternHighlightMeshes, highlightMesh]);
                groupRef.current?.add(highlightMesh.mesh);
            }
    
            for (let tempHighlightMesh of patternHighlightMeshes) 
                if (!task?.annotations?.find(archetype => archetype.nameId === tempHighlightMesh.name)) {
                    groupRef.current?.remove(tempHighlightMesh.mesh);
                    setPatternHighlightMeshes(patternHighlightMeshes.filter(mesh => mesh.name !== tempHighlightMesh.name));
                }
            
        }

		for (let archetype of task?.annotations ?? []) {
			const meshToHighlight = patternHighlightMeshes.find(mesh => mesh.name === archetype.nameId)?.mesh;
			if (!meshToHighlight) continue;

			let hexColor = archetype.color.padStart(6, '0');
			(meshToHighlight.material as MeshBasicMaterial).color.set(hexColor)

			const patternIndices = archetype.entities.flatMap(entity => entity.faceIds);
			highlightIndices(originalMesh, meshToHighlight, patternIndices);
		}
    }

	useEffect(() => {
		init();

		return () => {
			dispose();
			setPatternHighlightMeshes([]);
		}
	}, [proxyGeometry, proxyMaterial]);

	useEffect(() => {
        if (!selectedIndices) return;

        highlightIndices(originalMesh, selectionHighlightMesh, selectedIndices);
    }, [selectedIndices]);

	useEffect(() => {
        // Check if the number of archetypes has changed
        const updateEntitiesOnly = task?.annotations?.length === patternHighlightMeshes.length;

        updateHighlightMeshes(updateEntitiesOnly);
    }, [task?.annotations]);

	return (
		<div className="small-canvas">
			<CrossHairs resolution={50}/>
			<Canvas camera={{ position: [0, 0, 2] }}>
				<LookAtIndex />
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{groupRef.current && <primitive object={groupRef.current} />}
			</Canvas>
		</div>
	);
}
