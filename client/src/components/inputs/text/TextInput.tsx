import React from 'react'

interface TextInputProps {
    text: string
    label?: string
}
function TextInput(props: TextInputProps) {
    return (
        <div className='text-input-container'>
            { props.label ? <label>{props.label}</label>: null}
            <input type="text" defaultValue={props.text}/>
        </div>
    )
}

export default TextInput