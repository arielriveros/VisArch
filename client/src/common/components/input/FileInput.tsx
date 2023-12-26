import React from 'react'

interface FileInputProps {
    targetName: string;
    text: string;
    label?: string;
    handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileInput(props: FileInputProps) {
    return (
        <div className='file-input-container'>
            { props.label ? <label>{props.label}</label>: null}
            <input name={props.targetName} type="file" title={props.text} onChange={props.handleFileInput}/>
        </div>
    )
}

export default FileInput