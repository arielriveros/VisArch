import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, Mesh } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useTaskContext } from '../../../hooks/useTask';
import CrossHairs from './CrossHairs';
import LookAtIndex from './LookAtIndex';
import SelectionHighlightMesh from '../highlightMesh/SelectionHighlightMesh';
import HighlightMesh from '../highlightMesh/HighlightMesh';
import './AnnotationViewer.css';

export default function AnnotationViewer() {
	const { task, selectedEntity } = useTaskContext();
	const { proxyGeometry, proxyMaterial } = useProxyMeshContext();

	const groupRef = useRef<Group | null>(null);

	const init = () => {
		groupRef.current = new Group();

		if(!proxyGeometry || !proxyMaterial) return;

        const originalMesh = new Mesh();
		originalMesh.geometry = proxyGeometry.clone();
		originalMesh.material = proxyMaterial.clone();

        groupRef.current?.add(originalMesh);
	}

	const dispose = () => {
		if (!groupRef.current) return;

		for (let child of groupRef.current.children)  {
			(child as Mesh).geometry.dispose();
			groupRef.current.remove(child);
		}
	}

	useEffect(() => {
		init();

		return () => {
			dispose();
		}
	}, [proxyGeometry, proxyMaterial]);

	return (
		<div className="small-canvas">
			<Canvas camera={{ position: [0, 0, 2] }}>
				<LookAtIndex />
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{groupRef.current && <primitive object={groupRef.current} />}
				{proxyGeometry &&
                    <>
                        <SelectionHighlightMesh geometry={proxyGeometry} color={'red'} wireframe={true} toHighlight={selectedEntity} pulse={false}/>
                        { 
                        task?.annotations?.map(archetype => 
                            <HighlightMesh key={archetype.nameId} name={archetype.nameId} geometry={proxyGeometry} color={archetype.color} />
                        )}
                    </>
                }
			</Canvas>
			<CrossHairs resolution={50}/>
		</div>
	);
}
