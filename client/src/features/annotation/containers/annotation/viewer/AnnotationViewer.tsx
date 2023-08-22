import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, Mesh, MeshBasicMaterial } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useIndicesContext } from '../../../hooks/useIndices';
import { useTaskContext } from '../../../hooks/useTask';
import CrossHairs from './CrossHairs';
import LookAtIndex from './LookAtIndex';
import './AnnotationViewer.css';
import SelectionHighlightMesh from '../highlightMesh/SelectionHighlightMesh';
import HighlightMesh from '../highlightMesh/HighlightMesh';

export default function AnnotationViewer() {
	const { task } = useTaskContext();
	const { proxyGeometry, proxyMaterial } = useProxyMeshContext();
	const [originalMesh, setOriginalMesh] = useState<Mesh>(new Mesh());

	const groupRef = useRef<Group | null>(null);

	const init = () => {
		groupRef.current = new Group();

		if(!proxyGeometry || !proxyMaterial) return;

        const originalMesh = new Mesh();
		originalMesh.geometry = proxyGeometry.clone();
		originalMesh.material = proxyMaterial.clone();

        setOriginalMesh(originalMesh);
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
			<CrossHairs resolution={50}/>
			<Canvas camera={{ position: [0, 0, 2] }}>
				<LookAtIndex />
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{groupRef.current && <primitive object={groupRef.current} />}
				{proxyGeometry &&
                    <>
                        <SelectionHighlightMesh geometry={proxyGeometry} color={'red'} wireframe={true}/>
                        { 
                        task?.annotations?.map(archetype => 
                            <HighlightMesh key={archetype.nameId} name={archetype.nameId} geometry={proxyGeometry} color={archetype.color} />
                        )}
                    </>
                }
			</Canvas>
		</div>
	);
}
