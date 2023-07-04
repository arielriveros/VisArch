import TextInput from '../../components/inputs/text/TextInput'
import FileInput from '../../components/inputs/file/FileInput'
import './MeshInput.css'
import { useState } from 'react';

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

    function submit(): void {
        // TODO: Validate form data
        const data = new FormData();
        data.append('name', formData.formName);
        if(formData.selectedObj)
            data.append('model', formData.selectedObj);

        if(formData.selectedMtl)
            data.append('material', formData.selectedMtl);

        if(formData.selectedTex)
            data.append('texture', formData.selectedTex);

        console.log(data);
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
