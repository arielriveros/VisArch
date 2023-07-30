import { Canvas, useThree } from '@react-three/fiber';
import { IntersectionPayload } from '../manager/AnnotationManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';
import { useProxyMeshContext } from '../../../hooks/useProxyMesh';
import './AnnotationController.css';

function CameraController() {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);  
        controls.enablePan = true;
        controls.enableZoom = true;
		controls.enableRotate = false;
		controls.minZoom = 0.1;
		controls.maxZoom = 10;

        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    
    return null;
}

function SelectIndex(props: {selectIndex: (index: IntersectionPayload | null) => void}) {
    const { raycaster, scene } = useThree();
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
        // Attach the event listener on mount
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
        // Remove the event listener on unmount
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

	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 5] }}>
				<CameraController />
                <SelectIndex selectIndex={(index: IntersectionPayload | null)=>selectIndexHandler(index)} />
				<ambientLight />
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
				{proxyMesh?.geometry && <mesh geometry={proxyMesh.geometry} material={proxyMesh.material} />}
			</Canvas>
		</div>
	);
}
