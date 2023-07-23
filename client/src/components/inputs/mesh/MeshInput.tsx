import { useEffect, useState } from "react";
import { TextureLoader, Mesh, Group, Object3D } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { ModelPreview } from "../../preview/ModelPreview";
import PreviewRenderer from "../../preview/PreviewRenderer";

type ModelInputProps = {
    meshHandler: (glbFile: File) => void;
};
  
type ModelData = {
    modelPath: string;
    texturePath: string;
};

export default function MeshInput( props : ModelInputProps): JSX.Element {
	const [modelFiles, setModelFiles] = useState<FileList | null>(null);
	const [groupMesh, setGroupMesh] = useState<Group | null>(null);
	const [previewModelData, setPreviewModelData] = useState<ModelData>({
        modelPath: "",
        texturePath: ""
    });

    // TODO: implement different model formats  (e.g. gltf)
    const objLoader = new OBJLoader();
    const textureLoader = new TextureLoader();

    const convertToGLB = (obj: Object3D, onComplete: (output: File) => void, onError: (output: ErrorEvent) => void ) => {
      	const exporter = new GLTFExporter();

      	exporter.parse(
			obj,
			gltf => {
				const blob = new Blob([gltf as BlobPart], { type: "application/octet-stream" });
				const glbFile = new File([blob], `${previewModelData.modelPath}.glb`, { type: "model/gltf-binary" });
				onComplete(glbFile);
			},
			error => {
				onError(error);
			},
			{ binary: true }
      );
    }

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'model')
            setModelFiles(e.target.files);
    }

	const loadMesh = (modelPath: string, texturePath: string, onLoad: (group: Group) => void) => {
		if (modelPath === "") return;
		objLoader.load(
			modelPath,
			(obj) => {
				obj.traverse((child) => {
					if (child instanceof Mesh) {
						textureLoader.load(
							texturePath,
							tex => {
								child.material.side = 2;
								child.material.map = tex;
								child.material.needsUpdate = true;
								onLoad(obj as Group);
							}
						);
					}
				});
			}
		);
	}

    useEffect(() => {
		loadMesh(previewModelData.modelPath, previewModelData.texturePath, setGroupMesh);
    }, [previewModelData.modelPath, previewModelData.texturePath]);

	useEffect(() => {
		if (modelFiles) {
			const files = Array.from(modelFiles);
			for (let file of files) {
				const extension = file.name.split('.').pop();
				if (extension === 'obj')
					setPreviewModelData({ ...previewModelData, modelPath: URL.createObjectURL(file as File) });
				if (['png', 'jpg', 'jpeg'].includes(extension as string))
					setPreviewModelData({ ...previewModelData, texturePath: URL.createObjectURL(file as File) });
			}
		}
	}, [modelFiles]);

	useEffect(() => {
		if (groupMesh)
			convertToGLB(groupMesh, props.meshHandler, error => console.error(error));
	}, [groupMesh]);

    return (
		<>
			<div>
                <label htmlFor='model'>Mesh Model</label>
                <input type='file' id='model' name='model' onChange={handleChange} multiple />
            </div>
			<PreviewRenderer>
			{
				previewModelData.modelPath && previewModelData.texturePath ? 
					<ModelPreview modelGroup={groupMesh} />
					: null
			}
			</PreviewRenderer> 
		</>
    );
}