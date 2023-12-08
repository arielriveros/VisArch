import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useTaskContext } from "../../../hooks/useTask";

export default function CameraController() {
    const { camera, gl } = useThree();
    const { task } = useTaskContext();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);  

        controls.enablePan = true;
        controls.enableZoom = true;
        controls.enableDamping = false;
        controls.minDistance = 0.1;
        controls.maxDistance = 10;
        controls.maxZoom = 0.1;
        if (task?.class === 'object') {
            controls.enableRotate = false;
            controls.zoomSpeed = 1.5;
            controls.panSpeed = 0.5;
        }

        else {
            controls.enableRotate = true;
            controls.zoomSpeed = 1.5;
            controls.panSpeed = 0.25;
        }

        // rotate with middle mouse button
        controls.mouseButtons = {
            MIDDLE: 0,
            RIGHT: 2
        };




        controls.update();

        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    
    return null;
}