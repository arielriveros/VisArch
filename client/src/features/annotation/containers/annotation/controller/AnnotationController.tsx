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
import Confirmation from '../../../components/confirmation/Confirmation';
import { useTaskContext } from '../../../hooks/useTask';

interface AnnotationViewerProps {
    hoverIndexHandler: (index: IntersectionPayload | null) => void;
    selectIndicesHandler: (indices: number[]) => void;
}

export default function AnnotationController(props: AnnotationViewerProps) {
    const { selectedArchetype: archetype } = useTaskContext();
	const { hoverIndexHandler, selectIndicesHandler } = props;
    const { proxyMesh } = useProxyMeshContext();
    const [unwrappedMesh , setUnwrappedMesh] = useState<Group | null>(null);
    const [highlightMesh , setHighlightMesh] = useState<Mesh>(new Mesh());
    const [unwrapAxis, setUnwrapAxis] = useState<'x' | 'y' | 'z'>('y');
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [tempIndices, setTempIndices] = useState<number[]>([]);

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
            unwrappedMesh.geometry.rotateY(-Math.PI / 2);
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

    const onConfirm = () => {
        setShowConfirmation(false);
        selectIndicesHandler(tempIndices);
    }

    const onCancel = () => {
        setShowConfirmation(false);
        highlightIndices([]);
        setTempIndices([]);
    }

    const highlightIndices = (indices: number[]) => {
        let newIndices: number[] = [];
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i] * 3;
            const a = index + 0;
            const b = index + 1;
            const c = index + 2;
            newIndices.push(a, b, c);
        }

        const indexAttr = (unwrappedMesh?.children[0] as Mesh).geometry.index;
        const newIndexAttr = highlightMesh.geometry.index;
        // update the highlight mesh
        for ( let i = 0, l = newIndices.length; i < l; i ++ ) {
            const ix = indexAttr?.getX( newIndices[i] );
            newIndexAttr?.setX( i, ix as number );
        }

        highlightMesh.geometry.drawRange.count = newIndices.length;
        if (newIndexAttr)
            newIndexAttr.needsUpdate = true;
    }
        
    const indicesSelectHandler = (indices: number[]) => {
        setTempIndices(indices);
        highlightIndices(indices);
        setShowConfirmation(true);
    }

    useEffect(() => {
        unwrapMesh();
        setShowConfirmation(false);
        return () => disposeMesh();
    }, [proxyMesh, unwrapAxis]);


	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 2] }}>
				<CameraController />
                <HoverIndex rate={0} handleHover={hoverIndexHandler} />
                <LassoSelector
                    mesh={unwrappedMesh?.children[0] as Mesh}
                    handleOnSelect={ (!showConfirmation) && archetype ? indicesSelectHandler : ()=>{}}
                />
				<ambientLight />
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
                {unwrappedMesh && <primitive object={unwrappedMesh}  />}
			</Canvas>
            {showConfirmation && <Confirmation label={"Add Pattern?"} onConfirm={onConfirm} onCancel={onCancel} />}
		</div>
	);
}
