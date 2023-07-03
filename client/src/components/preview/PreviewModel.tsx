import React from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useLoader } from '@react-three/fiber';

interface PreviewModelProps {
    obj: string;
    mtl: string;
}

export default function PreviewModel(props: PreviewModelProps): JSX.Element {
    // TODO: implement different model formats  (e.g. gltf)
    const mtl = useLoader(MTLLoader, props.mtl);
    const obj = useLoader(OBJLoader, props.obj, loader => {
        mtl.preload();
        loader.setMaterials(mtl);
    });
    
    return (
        <primitive object={obj} material={mtl} />
    )
}