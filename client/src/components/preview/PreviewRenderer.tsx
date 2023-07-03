import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';

interface PreviewRendererProps {
    model: JSX.Element;
}

function PreviewGroup(props: PreviewRendererProps)
{
    const modelRef = useRef<any>();

    useFrame(() => {
        if (modelRef.current) {
        modelRef.current.rotation.y += 0.01; // Adjust the rotation speed as needed
        }
    });

    return (
        <group ref={modelRef}>
            {props.model}
        </group>
    )
}

export default function PreviewRenderer(props: PreviewRendererProps): JSX.Element {
    return (
        <Canvas camera={{position: [0, 100, 100]}}>
            <color attach="background" args={['#f5efe6']} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <PreviewGroup model={props.model} />
        </Canvas>
    )
}