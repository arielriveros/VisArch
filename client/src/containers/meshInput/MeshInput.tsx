import TextInput from '../../components/inputs/text/TextInput'
import FileInput from '../../components/inputs/file/FileInput'
import './MeshInput.css'
import { useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { DoubleSide, Mesh, TextureLoader } from 'three';


interface IFormData {
    formName: string;
    selectedObj: File | null;
    selectedMtl: File | null;
    selectedTex: File | null;
}

export default function MeshInput() {
    const [formData, setFormData] = useState<IFormData>({
        formName: "",
        selectedObj: null,
        selectedMtl: null,
        selectedTex: null
    });

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e);
        setFormData({...formData, [e.target.name]: e.target.files ? e.target.files[0] : e.target.value});
        console.log(formData);
    }

    function objToGlb(obj: File, mtl: File, tex: File): Promise<File> {
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader();
            const mtlLoader = new MTLLoader();
            const texLoader = new TextureLoader();
            const gltfExporter = new GLTFExporter();
    
            mtlLoader.load(URL.createObjectURL(mtl), (mtl) => {
                mtl.preload();
                objLoader.setMaterials(mtl);
                objLoader.load(URL.createObjectURL(obj), (obj) => {
                    texLoader.load(URL.createObjectURL(tex), (tex) => {
                        obj.traverse((child) => {
                            if (child instanceof Mesh) {
                                child.material.side = DoubleSide;
                                child.material.map = tex;
                            }
                        });
                        gltfExporter.parse(
                            obj,
                            (gltf) => {
                                const blob = new Blob([gltf as BlobPart], { type: 'application/octet-stream' });
                                const glbFile = new File([blob], 'model.glb', { type: 'model/gltf-binary' });
                                resolve(glbFile);
                            },
                            (error) => {
                                reject(error);
                            },
                            { binary: true }
                        );
                    });
                });
            });
        });
    }

    async function submit(): Promise<void> {
        // TODO: Validate form data
        const data = new FormData();
        data.append('name', formData.formName);

        const convertedFile = await objToGlb(formData.selectedObj!, formData.selectedMtl!, formData.selectedTex!);
        data.append('model', convertedFile);

        // TODO: Use url from env
        fetch('http://localhost:5000/api/meshes', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error(error));
    }

    return (
        <div className='mesh-input'>
            <h5> New Model </h5>
            <form>
                <TextInput targetName="formName"    text=""  label="Name"  handleInput={handleOnChange}/>
                <FileInput targetName="selectedObj" text=""  label=".obj File"      handleFileInput={handleOnChange}/>
                <FileInput targetName="selectedMtl" text=""  label=".mtl File"      handleFileInput={handleOnChange}/>
                <FileInput targetName="selectedTex" text=""  label="Texture File"   handleFileInput={handleOnChange}/>
                <button type="button" onClick={submit}>Submit</button>
            </form>
        </div>
    )
}
