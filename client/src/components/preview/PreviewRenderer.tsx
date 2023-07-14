import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import PreviewModel from './PreviewModel';

interface PreviewRendererProps {
    source: string;
}

function PreviewGroup(props: PreviewRendererProps)
{
    const groupRef = useRef<any>();
    const [model, setModel] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (props.source !== "")
            setModel(<PreviewModel model={props.source}/>);
    }, [props.source]);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group ref={groupRef}>
            {model ? model : null}
        </group>
    )
}

export default function PreviewRenderer(props: PreviewRendererProps): JSX.Element {
    return (
        <Canvas camera={{position: [0, 55, 55]}}>
            <color attach="background" args={['#f5efe6']} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <PreviewGroup source={props.source} />
        </Canvas>
    )
}