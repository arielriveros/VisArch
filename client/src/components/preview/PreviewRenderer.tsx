import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import { ModelSource } from '../../containers/meshList/MeshList';
import PreviewModel from './PreviewModel';

interface PreviewRendererProps {
    source: ModelSource;
}

function PreviewGroup(props: PreviewRendererProps)
{
    const groupRef = useRef<any>();

    const [model, setModel] = useState(<PreviewModel obj={props.source.obj} mtl={props.source.mtl} />);

    useEffect(() => {
        setModel(<PreviewModel obj={props.source.obj} mtl={props.source.mtl} />);
    }, [props.source]);

    //const model = <PreviewModel obj={props.source.obj} mtl={props.source.mtl} />;

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.01; // Adjust the rotation speed as needed
        }
    });

    return (
        <group ref={groupRef}>
            {model}
        </group>
    )
}

export default function PreviewRenderer(props: PreviewRendererProps): JSX.Element {
    return (
        <Canvas camera={{position: [0, 100, 100]}}>
            <color attach="background" args={['#f5efe6']} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <PreviewGroup source={props.source} />
        </Canvas>
    )
}