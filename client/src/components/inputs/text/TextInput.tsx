import React from 'react'
import './TextInput.css'

interface TextInputProps {
    targetName: string;
    text?: string;
    label?: string;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: 'text' | 'password';
}
function TextInput(props: TextInputProps) {
    return (
        <div className='text-input-container'>
            { props.label ? <label>{props.label}</label>: null}
            <input className='text-input' name={props.targetName} type={props.type} defaultValue={props.text} onChange={props.handleInput}/>
        </div>
    )
}

export default TextInput