import React from 'react'

interface TextInputProps {
    targetName: string;
    text: string;
    label?: string;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
function TextInput(props: TextInputProps) {
    return (
        <div className='text-input-container'>
            { props.label ? <label>{props.label}</label>: null}
            <input name={props.targetName} type="text" defaultValue={props.text} onChange={props.handleInput}/>
        </div>
    )
}

export default TextInput