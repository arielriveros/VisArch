import React from 'react'
import './Input.css'

interface TextInputProps {
    targetName: string;
    type: 'text' | 'password';
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    text?: string;
    label?: string;
    hint?: string;
    value?: string;
}
function TextInput(props: TextInputProps) {
    return (
        <div className='input-container'>
            { props.label && <label>{props.label}</label> }
            <input 
                className='text-input'
                name={props.targetName}
                type={props.type}
                placeholder={props.text} 
                autoComplete='off'
                onChange={props.handleInput}
                value={props.value}
            />
        </div>
    )
}

export default TextInput