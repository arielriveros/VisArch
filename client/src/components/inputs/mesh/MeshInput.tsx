import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import { TextureLoader, Mesh } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { ModelPreview } from "../../preview/ModelPreview";

type ModelInputProps = {
    modelPath: string;
    texturePath: string;
    onModelConverted: (glbFile: File) => void;
};
  
export default function MeshInput( props : ModelInputProps): JSX.Element {
    // TODO: implement different model formats  (e.g. gltf)
    const obj = useLoader(OBJLoader, props.modelPath);
    const texture = useLoader(TextureLoader, props.texturePath);
    const exporter = new GLTFExporter();

    // Replace the texture of all materials in the loaded model
    // TODO: find a better way to do this, only works on single mesh models
    obj.traverse((child) => {
        if (child instanceof Mesh) {
            child.material.side = 2;
            child.material.map = texture;
            child.material.needsUpdate = true;
        }
    });

    useEffect(() => {
        exporter.parse(
            obj,
            (gltf) => {
                const blob = new Blob([gltf as BlobPart], { type: 'application/octet-stream' });
                const glbFile = new File([blob], `${props.modelPath}.glb`, { type: 'model/gltf-binary' });
                props.onModelConverted(glbFile);
            }, 
            (error) => { console.error(error); },
            { binary: true }
        );
      }, [props.modelPath]);

    return (
        <ModelPreview modelGroup={obj} />
    );
}