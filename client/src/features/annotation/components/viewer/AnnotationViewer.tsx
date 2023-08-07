import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, Mesh } from 'three';
import { useProxyMeshContext } from '../../hooks/useProxyMesh';
import { useIndicesContext } from '../../hooks/useIndices';
import { highlightIndices } from '../../utils/highlightIndices';
import { createHighlightMesh } from '../../utils/createHighlightMesh';
import CrossHairs from './CrossHairs';
import LookAtIndex from './LookAtIndex';
import './AnnotationViewer.css';

export default function AnnotationViewer() {

	const { proxyGeometry, proxyMaterial } = useProxyMeshContext();
	const { selectedIndices } = useIndicesContext();
	const [originalMesh, setOriginalMesh] = useState<Mesh>(new Mesh());
	const [highlightMesh, setHighlightMesh] = useState<Mesh>(new Mesh());

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
        setHighlightMesh(highlightMesh);
        groupRef.current?.add(highlightMesh);
	}

	const dispose = () => {
		if (!groupRef.current) return;

		for (let child of groupRef.current.children)  {
			(child as Mesh).geometry.dispose();
			groupRef.current.remove(child);
		}

		highlightMesh.geometry.dispose();
		groupRef.current.remove(highlightMesh);
	}

	useEffect(() => {
		init();

		return () => {
			dispose();
		}
	}, [proxyGeometry, proxyMaterial]);

	useEffect(() => {
        if (!selectedIndices) return;

        highlightIndices(originalMesh, highlightMesh, selectedIndices);
    }, [selectedIndices]);

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
