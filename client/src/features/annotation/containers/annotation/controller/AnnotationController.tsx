import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Group, Material, Mesh } from 'three';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { useTaskContext } from '../../../hooks/useTask';
import { config } from '../../../../../utils/config';
import { useSocket } from '../../../../socket/hooks/useSocket';
import CameraController from './CameraController';
import HoverIndex from './HoverIndex';
import LassoSelector from './LassoSelector';
import HighlightMesh from '../highlightMesh/HighlightMesh';
import SelectionHighlightMesh from '../highlightMesh/SelectionHighlightMesh';
import DebugGroup from './debugGroup/DebugGroup';
import PropertyController from '../propertyController/PropertyController';
import useTaskDispatcher from '../../../../taskDispatcher';
import './AnnotationController.css';

export default function AnnotationController() {
    const { task, selectedArchetype, loading, selectedEntity, showPropertyController } = useTaskContext();
    const { proxyGeometry, proxyMaterial, unwrappedGeometry } = useProxyMeshContext();
    const { socket } = useSocket();
    const DISPATCH = useTaskDispatcher();
    const [unwrappedMesh, setUnwrappedMesh] = useState<Mesh>(new Mesh());
    
    const groupRef = useRef<Group | null>(null)

    let showPropertyControllerWindow: boolean = showPropertyController && unwrappedGeometry !== null && selectedEntity !== null && selectedArchetype !== null;

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
        if(!socket) return;

        socket.on('BROADCAST::ADD_PATTERN_ARCHETYPE', (name: any) => {
            DISPATCH.ADD_PATTERN_ARCHETYPE(name, false);
        });

        socket.on('BROADCAST::REMOVE_PATTERN_ARCHETYPE', (name: any) => {
            DISPATCH.REMOVE_PATTERN_ARCHETYPE(name, false);
        });

        socket.on('BROADCAST::ADD_PATTERN_ENTITY', (data: any) => {
            DISPATCH.ADD_PATTERN_ENTITY(data.archetypeName, data.patternIndices, data.name, false);
        });

        socket.on('BROADCAST::REMOVE_PATTERN_ENTITY', (data: any) => {
            DISPATCH.REMOVE_PATTERN_ENTITY(data.patternArchetypeName, data.patternEntityName, false);
        });

        socket.on('BROADCAST::UPDATE_PATTERN_ENTITY_PROPERTIES', (data: any) => {
            DISPATCH.UPDATE_PATTERN_ENTITY_PROPERTIES(data.patternArchetypeName, data.patternEntityName, data.entityProperties, false);
        });

        socket.on('BROADCAST::UPDATE_PATTERN_ARCHETYPE_LABEL', (data: any) => {
            DISPATCH.UPDATE_PATTERN_ARCHETYPE_LABEL(data.patternArchetypeName, data.label, false);
        });

        return () => {
            socket.off('BROADCAST::ADD_PATTERN_ARCHETYPE');
            socket.off('BROADCAST::REMOVE_PATTERN_ARCHETYPE');
            socket.off('BROADCAST::ADD_PATTERN_ENTITY');
            socket.off('BROADCAST::REMOVE_PATTERN_ENTITY');
            socket.off('BROADCAST::UPDATE_PATTERN_ENTITY_PROPERTIES');
            socket.off('BROADCAST::UPDATE_PATTERN_ARCHETYPE_LABEL');
        }
    }, [socket]);

    useEffect(() => {
        if(loading) return;
        init();
        return () => {
            disposeMesh()
        };
    }, [proxyGeometry, proxyMaterial]);

	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 2] }} frameloop={'always'}>
				<CameraController />
                { !showPropertyController &&
                    <>
                        <HoverIndex 
                            rate={0} 
                            mesh={unwrappedMesh as Mesh}
                        />
                        <LassoSelector
                            mesh={unwrappedMesh as Mesh}
                            handleOnSelect={ indicesSelectHandler }
                        />
                    </>
                }
				<ambientLight />
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
                {groupRef.current && <primitive object={groupRef.current} />}
                {unwrappedGeometry &&
                    <>
                        <SelectionHighlightMesh geometry={unwrappedGeometry} color={'red'} wireframe={config.DEBUG}/>
                        { 
                        task?.annotations?.map(archetype => 
                            <HighlightMesh key={archetype.nameId} name={archetype.nameId} geometry={unwrappedGeometry} color={archetype.color} />
                        )}
                    </>
                }
                <DebugGroup debug={config.DEBUG} bvhMesh={unwrappedMesh} showMonitor={config.DEBUG}/>
                
			</Canvas>
            { 
                showPropertyControllerWindow && 
                <PropertyController/>
            }
		</div>
	);
}
