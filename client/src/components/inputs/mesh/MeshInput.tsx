import { useEffect, useState } from "react";
import { TextureLoader, Mesh, Group, Object3D, MeshBasicMaterial, BufferGeometry } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { ModelPreview } from "../../preview/ModelPreview";
import PreviewRenderer from "../../preview/PreviewRenderer";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

type ModelInputProps = {
    meshHandler: (glbFile: File) => void;
};
  
type ModelData = {
    modelPath: string;
	format: SupportedFormat | null;
    texturePath: string;
};

type SupportedFormat = 'obj' | 'ply';

export default function MeshInput( props : ModelInputProps): JSX.Element {
	const [modelFiles, setModelFiles] = useState<FileList | null>(null);
	const [groupMesh, setGroupMesh] = useState<Group | null>(null);
	const [previewModelData, setPreviewModelData] = useState<ModelData>({
        modelPath: "",
		format: null,
        texturePath: ""
    });

    const convertToGLB = (obj: Object3D, onComplete: (output: File) => void, onError: (output: ErrorEvent) => void ) => {
      	const exporter = new GLTFExporter();

		obj.traverse((child) => {
			if (child instanceof Mesh) {
				const geometry = child.geometry;
				const newGeometry = BufferGeometryUtils.mergeVertices(geometry);
				child.geometry = newGeometry;
			}
		});

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

	const loadMesh = (modelPath: string, texturePath: string, format: SupportedFormat , onLoad: (group: Group) => void) => {
		const objLoader = new OBJLoader();
		const plyLoader = new PLYLoader();
		const textureLoader = new TextureLoader();

		if (!modelPath) return;

		const setMaterial = (obj: Group) => {
			obj.traverse((child) => {
				if (child instanceof Mesh) {
					child.material.side = 2;
					child.material.needsUpdate = true;
					if (!texturePath)
						onLoad(obj as Group);
					else {
						textureLoader.load(
							texturePath,
							tex => {
								child.material.map = tex;
								onLoad(obj as Group);
							}
						);
					}
				}
			});
		}

		switch(format) {
			case 'obj':
				objLoader.load(
					modelPath,
					obj => setMaterial(obj)
				);
				break;

			case 'ply':
				plyLoader.load(
					modelPath,
					obj => { 
						const mesh = new Mesh(obj, new MeshBasicMaterial());
						const group = new Group();
						group.add(mesh);
						setMaterial(group);
					}
				)
				break;

			default:
				break;
		}
	}

    useEffect(() => {
		if (previewModelData.format)
			loadMesh(previewModelData.modelPath, previewModelData.texturePath, previewModelData.format, setGroupMesh);
    }, [previewModelData]);

	useEffect(() => {
		if (modelFiles) {
			const files = Array.from(modelFiles);
			for (let file of files) {
				const extension = file.name.split('.').pop();
				if (extension === 'obj') {
					setPreviewModelData( ( prev ) => (
						{ ...prev, 
							modelPath: URL.createObjectURL(file as File),
							format: 'obj' 
						})
					);
				}

				if (extension === 'ply') {
					setPreviewModelData( ( prev ) => (
						{ ...prev, 
							modelPath: URL.createObjectURL(file as File),
							format: 'ply' 
						})
					);
				}
					
				if (['png', 'jpg', 'jpeg'].includes(extension as string))
					setPreviewModelData( ( prev ) => ({ ...prev, texturePath: URL.createObjectURL(file as File) }));
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
				previewModelData.modelPath ? 
					<ModelPreview modelGroup={groupMesh} />
					: null
			}
			</PreviewRenderer> 
		</>
    );
}