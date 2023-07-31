import { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { IntersectionPayload } from '../manager/AnnotationManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import { BufferAttribute, BufferGeometry, Group, Material, Mesh, NormalBufferAttributes } from 'three';
import { radialUnwrap } from '../../../utils/radialUnwrap';
import { flattenAxis } from '../../../utils/flattenAxis';
import './AnnotationController.css';

function CameraController() {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);  
        controls.enablePan = true;
        controls.enableZoom = true;
		controls.enableRotate = false;
        controls.enableDamping = false;
        controls.maxZoom = 0.1;
        controls.zoomSpeed = 1.5;
        controls.panSpeed = 0.5;

        controls.minDistance = 0.1;
        controls.maxDistance = 10;


        controls.update();

        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    
    return null;
}

function SelectIndex(props: {
    handleHover: (index: IntersectionPayload | null) => void
    handleSelect: (index: IntersectionPayload | null) => void
}) {
    const { raycaster, scene } = useThree();
    let isThrottled = false;

    const raycast = () => {
        // Perform raycasting and intersection calculations
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            const intersection: IntersectionPayload = {
                face: intersects[0].face ? intersects[0].face : null,
                faceIndex: intersects[0].faceIndex !== undefined ? intersects[0].faceIndex : null,
            };
            return intersection;
        } else {
            return null;
        }
    }


    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        if(isThrottled) return;
        isThrottled = true;
    
        const intersection = raycast();
        props.handleHover(intersection);
    
        // Set a timeout to reset the throttling flag
        setTimeout(() => isThrottled = false, 1);
    };

    const handleMouseClick = (e: MouseEvent) => {
        e.preventDefault();

        const intersection = raycast();
        props.handleSelect(intersection);
    }

    useEffect(() => {
        window.addEventListener('click', handleMouseClick);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleMouseClick);
        };
    }, []);

    return null;
}

interface AnnotationViewerProps {
    hoverIndexHandler: (index: IntersectionPayload | null) => void;
    selectIndexHandler: (index: IntersectionPayload | null) => void;
}

export default function AnnotationController(props: AnnotationViewerProps) {

    const { proxyMesh } = useProxyMeshContext();
	const { hoverIndexHandler, selectIndexHandler } = props;
    const [unwrappedMesh , setUnwrappedMesh] = useState<Group | null>(null);
    const [unwrapAxis, setUnwrapAxis] = useState<'x' | 'y' | 'z'>('y');

    const unwrapMesh = () => {
        const material: Material | undefined = proxyMesh?.material?.clone();            
        if(material) material.side = 0;
        const unwrappedMesh = new Mesh(proxyMesh?.geometry?.clone() as BufferGeometry<NormalBufferAttributes>, material);
        const group = new Group();
        group.add(unwrappedMesh);
        
        if (proxyMesh?.geometry) {
            const unwrappedPositionsNotFlattened = radialUnwrap(Array.from(proxyMesh.geometry.attributes.position.array), unwrapAxis);
            const unwrappedPositions = flattenAxis(unwrappedPositionsNotFlattened, "x", 0.05);
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
                <SelectIndex 
                    handleHover={(index: IntersectionPayload | null)=>hoverIndexHandler(index)} 
                    handleSelect={(index: IntersectionPayload | null)=>selectIndexHandler(index)}
                />
				<ambientLight />
                {/* <axesHelper args={[5]} /> */}
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
                {unwrappedMesh && <primitive object={unwrappedMesh}  />}
			</Canvas>
		</div>
	);
}
