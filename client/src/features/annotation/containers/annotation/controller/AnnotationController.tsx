import { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { IntersectionPayload } from '../manager/AnnotationManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { BufferAttribute, BufferGeometry, Group, Material, Mesh, NormalBufferAttributes } from 'three';
import { radialUnwrap } from '../../../utils/radialUnwrap';
import './AnnotationController.css';

function CameraController() {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);  
        controls.enablePan = true;
        controls.enableZoom = true;
		controls.enableRotate = false;

        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    
    return null;
}

function SelectIndex(props: {selectIndex: (index: IntersectionPayload | null) => void}) {
    const { raycaster, scene, camera } = useThree();
    let isThrottled = false;

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        if(isThrottled) return;

        isThrottled = true;
        // Perform raycasting and intersection calculations
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            const intersection: IntersectionPayload = {
                face: intersects[0].face ? intersects[0].face : null,
                faceIndex: intersects[0].faceIndex !== undefined ? intersects[0].faceIndex : null,
            };
            props.selectIndex(intersection);
        }
    
        // Set a timeout to reset the throttling flag
        setTimeout(() => {
        isThrottled = false;
        }, 1);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return null;
}

interface AnnotationViewerProps {
    selectIndexHandler: (index: IntersectionPayload | null) => void;
}

export default function AnnotationController(props: AnnotationViewerProps) {

    const { proxyMesh } = useProxyMeshContext();
	const { selectIndexHandler } = props;
    const [unwrappedMesh , setUnwrappedMesh] = useState<Group | null>(null);
    const [unwrapAxis, setUnwrapAxis] = useState<'x' | 'y' | 'z'>('y');

    const unwrapMesh = () => {
        const material: Material | undefined = proxyMesh?.material?.clone();            
        if(material) material.side = 0;
        const unwrappedMesh = new Mesh(proxyMesh?.geometry?.clone() as BufferGeometry<NormalBufferAttributes>, material);
        const group = new Group();
        group.add(unwrappedMesh);
        
        if (proxyMesh?.geometry) {
            const unwrappedPositions = radialUnwrap(Array.from(proxyMesh.geometry.attributes.position.array), unwrapAxis);
            const positionsBufferAttribute = new BufferAttribute(new Float32Array(unwrappedPositions), 3);
            unwrappedMesh.geometry?.setAttribute('position', positionsBufferAttribute);
            unwrappedMesh.geometry?.rotateX(Math.PI / 2);
            unwrappedMesh.geometry?.rotateY(Math.PI / 2);

            unwrappedMesh.geometry?.translate(0, 2, 0);

            
            unwrappedMesh.geometry?.normalizeNormals();
            unwrappedMesh.geometry?.computeVertexNormals();
            unwrappedMesh.geometry?.computeTangents();
            unwrappedMesh.geometry?.computeBoundingBox();
            unwrappedMesh.geometry?.computeBoundingSphere();
            
        } 
        setUnwrappedMesh(group);
    };

    useEffect(() => {
        unwrapMesh();
    }, [proxyMesh, unwrapAxis]);


	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 5] }}>
				<CameraController />
                <SelectIndex selectIndex={(index: IntersectionPayload | null)=>selectIndexHandler(index)} />
				<ambientLight />
                {/* <axesHelper args={[5]} /> */}
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
                {unwrappedMesh && <primitive object={unwrappedMesh}  />}
			</Canvas>
		</div>
	);
}
