import React from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { Mesh } from 'three';

interface PreviewModelProps {
    obj: string;
    mtl: string;
    tex: string;
}

export default function PreviewModel(props: PreviewModelProps): JSX.Element {
    // TODO: implement different model formats  (e.g. gltf)
    const mtl = useLoader(MTLLoader, props.mtl);
    const obj = useLoader(
        OBJLoader, 
        props.obj, 
        loader => {
            mtl.preload();
            loader.setMaterials(mtl);
        },
        //progress => console.log(progress.loaded / progress.total * 100)
    );
    
    const texture = useLoader(TextureLoader, props.tex);

    // Replace the texture of all materials in the loaded model
    // TODO: find a better way to do this, only works on single mesh models
    obj.traverse((child) => {
        if (child instanceof Mesh) {
        child.material.map = texture;
        child.material.needsUpdate = true;
        }
    });

    return (
        <primitive object={obj} material={mtl} />
    )
}