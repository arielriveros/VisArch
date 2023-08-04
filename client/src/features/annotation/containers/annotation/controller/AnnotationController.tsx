import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { IntersectionPayload } from '../manager/AnnotationManager';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { BufferAttribute, BufferGeometry, Group, Material, Mesh, MeshBasicMaterial, NormalBufferAttributes } from 'three';
import { radialUnwrap } from '../../../utils/radialUnwrap';
import { flattenAxis } from '../../../utils/flattenAxis';
import CameraController from './CameraController';
import HoverIndex from './HoverIndex';
import LassoSelector from './LassoSelector';
import './AnnotationController.css';

interface AnnotationViewerProps {
    hoverIndexHandler: (index: IntersectionPayload | null) => void;
    selectIndexHandler: (index: IntersectionPayload | null) => void;
}

export default function AnnotationController(props: AnnotationViewerProps) {

    const { proxyMesh } = useProxyMeshContext();
	const { hoverIndexHandler, selectIndexHandler } = props;
    const [unwrappedMesh , setUnwrappedMesh] = useState<Group | null>(null);
    const [highlightMesh , setHighlightMesh] = useState<Mesh>(new Mesh());
    const [unwrapAxis, setUnwrapAxis] = useState<'x' | 'y' | 'z'>('y');

    const unwrapMesh = () => {
        const material: Material | undefined = proxyMesh?.material?.clone();            
        if (material) material.side = 0;
        const unwrappedMesh = new Mesh(proxyMesh?.geometry?.clone() as BufferGeometry<NormalBufferAttributes>, material);
        const group = new Group();
        group.add(unwrappedMesh);
        
        if (proxyMesh?.geometry) {
            const unwrappedPositionsNotFlattened = radialUnwrap(Array.from(proxyMesh.geometry.attributes.position.array), unwrapAxis);
            const unwrappedPositions = flattenAxis(unwrappedPositionsNotFlattened, "x", 0.05);
            const positionsBufferAttribute = new BufferAttribute(new Float32Array(unwrappedPositions), 3);

            unwrappedMesh.geometry.setAttribute('position', positionsBufferAttribute);

            unwrappedMesh.geometry.rotateX(Math.PI / 2);
            unwrappedMesh.geometry.rotateY(Math.PI / 2);
            unwrappedMesh.geometry.translate(0, 2, 0);
            
            unwrappedMesh.geometry.computeBoundsTree();
            unwrappedMesh.geometry.computeVertexNormals();
            unwrappedMesh.geometry.computeTangents();

            const highlightMesh = new Mesh();
            highlightMesh.geometry = unwrappedMesh.geometry.clone();
            highlightMesh.geometry.drawRange.count = 0;
            highlightMesh.material = new MeshBasicMaterial({
                opacity: 0.5,
                color: 0xff9800,
                depthWrite: false,
                transparent: true,
                
            });
            highlightMesh.renderOrder = 1;
            highlightMesh.geometry.computeBoundsTree();
            
            setHighlightMesh(highlightMesh);
            group.add(highlightMesh);
        } 
        setUnwrappedMesh(group);
    };

    const disposeMesh = () => {
        unwrappedMesh?.traverse((obj) => {
            if (obj instanceof Mesh) {
                obj.geometry.disposeBoundsTree();
                obj.geometry.dispose();
                obj.material.dispose();
            }
        });
        setUnwrappedMesh(null);
        highlightMesh?.geometry.disposeBoundsTree();
        highlightMesh?.geometry.dispose();
    }

    const indicesSelectHandler = (indices: number[]) => {
        const indexAttr = (unwrappedMesh?.children[0] as Mesh).geometry.index;
        const newIndexAttr = highlightMesh.geometry.index;
        // update the highlight mesh
        for ( let i = 0, l = indices.length; i < l; i ++ ) {
            const i2 = indexAttr?.getX( indices[i] );
            newIndexAttr?.setX( i, i2 as number );
        }

        highlightMesh.geometry.drawRange.count = indices.length;
        if (newIndexAttr)
            newIndexAttr.needsUpdate = true;
    }

    useEffect(() => {
        unwrapMesh();
        return () => disposeMesh();
    }, [proxyMesh, unwrapAxis]);


	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 5] }}>
				<CameraController />
                <HoverIndex rate={0} handleHover={hoverIndexHandler} />
                <LassoSelector mesh={unwrappedMesh?.children[0] as Mesh} handleOnSelect={indicesSelectHandler}/>
				<ambientLight />
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
                {unwrappedMesh && <primitive object={unwrappedMesh}  />}
			</Canvas>
		</div>
	);
}
