import React from 'react'

interface FileInputProps {
    text: string
    label?: string
}

function FileInput(props: FileInputProps) {
    return (
        <div className='file-input-container'>
            { props.label ? <label>{props.label}</label>: null}
            <input type="file" title={props.text} />
        </div>
    )
}

export default FileInput