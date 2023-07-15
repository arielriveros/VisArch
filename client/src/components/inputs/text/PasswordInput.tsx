import React from 'react'

interface PasswordInputProps {
    targetName: string;
    label?: string;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
function TextInput(props: PasswordInputProps) {
    return (
        <div className='text-input-container'>
            { props.label ? <label>{props.label}</label>: null}
            <input name={props.targetName} type="password" onChange={props.handleInput}/>
        </div>
    )
}

export default TextInput