import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Group, Material, Mesh } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import CameraController from './CameraController';
import HoverIndex from './HoverIndex';
import LassoSelector from './LassoSelector';
import HighlightMesh from '../highlightMesh/HighlightMesh';
import SelectionHighlightMesh from '../highlightMesh/SelectionHighlightMesh';
import DebugGroup from './debugGroup/DebugGroup';
import useTaskDispatcher from '../../../../taskDispatcher';
import './AnnotationController.css';

export default function AnnotationController() {
    const { task, selectedArchetype, loading, selectedEntity, hoveredEntity } = useTaskContext();
    const { proxyGeometry, proxyMaterial, unwrappedGeometry } = useProxyMeshContext();
    const DISPATCH = useTaskDispatcher();
    const [unwrappedMesh, setUnwrappedMesh] = useState<Mesh>(new Mesh());
    
    const groupRef = useRef<Group | null>(null)

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
        
    const indicesSelectHandler = (indices: number[]) => {
        if (indices.length < 3 || !selectedArchetype) return;
        DISPATCH.ADD_PATTERN_ENTITY(selectedArchetype.nameId, indices, null, true);        
    }

    useEffect(() => {
        if(loading) return;
        init();
        return () => {
            disposeMesh()
        };
    }, [proxyGeometry, proxyMaterial]);

	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 2], near:1e-4, far: 1000 }} frameloop={'always'}>
				<CameraController />
                <HoverIndex 
                    rate={0} 
                    mesh={unwrappedMesh as Mesh}
                />
                <LassoSelector
                    mesh={unwrappedMesh as Mesh}
                    handleOnSelect={ indicesSelectHandler }
                />
				<ambientLight />
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
                {groupRef.current && <primitive object={groupRef.current} />}
                {unwrappedGeometry &&
                    <>
                        {/* Selected Selection */}
                        <SelectionHighlightMesh
                            geometry={unwrappedGeometry}
                            color={'red'}
                            wireframe={true}
                            toHighlight={selectedEntity}
                            pulse={true}
                        />
                        {/* Hovered Selection */}
                        <SelectionHighlightMesh
                            geometry={unwrappedGeometry}
                            color={'orange'}
                            wireframe={false}
                            toHighlight={hoveredEntity}
                            pulse={false} 
                        />
                        { 
                        task?.annotations?.map(archetype => 
                            <HighlightMesh key={archetype.nameId} name={archetype.nameId} geometry={unwrappedGeometry} color={archetype.color} />
                        )}
                    </>
                }
                <DebugGroup debug={config.DEBUG} bvhMesh={unwrappedMesh} showMonitor={config.DEBUG}/>
                
			</Canvas>
		</div>
	);
}
