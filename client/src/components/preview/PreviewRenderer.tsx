import React, { useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function CameraController() {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);  
        controls.enablePan = false;
        controls.enableZoom = false;

        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    
    return null;
}

export default function PreviewRenderer({ children }: { children: React.ReactNode }) {

    return (
        <Canvas camera={{position: [0, 1, 1]}}>
            <CameraController />
            <color attach="background" args={['black']} />
            <ambientLight />
            { children }
        </Canvas>
  )
}
