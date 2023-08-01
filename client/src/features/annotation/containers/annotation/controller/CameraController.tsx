import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function CameraController() {
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