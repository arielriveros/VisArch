import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { Mesh } from 'three';

interface PreviewModelProps {
    model: string;
}

export default function PreviewModel(props: PreviewModelProps): JSX.Element {
    const gltf = useLoader(GLTFLoader, props.model);
    return <primitive object={gltf.scene} />;
}