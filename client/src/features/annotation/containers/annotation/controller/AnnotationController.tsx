import { Canvas, useThree } from '@react-three/fiber';
import { IntersectionPayload, ProxyMeshProperties } from '../manager/AnnotationManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';
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
    const { raycaster, camera, scene } = useThree();
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if(e.button !== 0) return;
            e.preventDefault();
            const intersects = raycaster.intersectObjects(scene.children, true);            
            if (intersects.length > 0) {
                const intersection: IntersectionPayload = {
                    face: intersects[0].face ? intersects[0].face : null,
                    faceIndex: intersects[0].faceIndex ? intersects[0].faceIndex : null
                 };
                props.selectIndex(intersection);
            }
        }

        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        }
    }, [raycaster, camera, scene]);

    return null;
}

interface AnnotationViewerProps extends ProxyMeshProperties {
    selectIndexHandler: (index: IntersectionPayload | null) => void;
}

export default function AnnotationController(props: AnnotationViewerProps) {

	const { geometry, material, selectIndexHandler } = props;

	return (
		<div className="annotation-viewer-container">
			<Canvas camera={{ position: [0, 0, 5] }}>
				<CameraController />
                <SelectIndex selectIndex={(index: IntersectionPayload | null)=>selectIndexHandler(index)} />
				<ambientLight />
				<color attach="background" args={['gray']} />
				<pointLight position={[10, 10, 10]} />
				{geometry && <mesh geometry={geometry} material={material} />}
			</Canvas>
		</div>
	);
}
