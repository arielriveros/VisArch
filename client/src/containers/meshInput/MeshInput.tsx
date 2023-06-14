import TextInput from '../../components/inputs/text/TextInput'
import FileInput from '../../components/inputs/file/FileInput'
import './MeshInput.css'

export default function MeshInput() {
    return (
        <div className='mesh-input'>
            <h5> New Model </h5>
            <TextInput text="name of the model"  label=""/>
            <FileInput text=""  label=".obj File"/>
            <FileInput text=""  label=".mtl File"/>
            <FileInput text=""  label="Texture File"/>
        </div>
    )
}
