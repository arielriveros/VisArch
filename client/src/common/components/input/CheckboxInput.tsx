import React from 'react'
import './Input.css'

interface CheckboxInputProps {
    targetName: string;
    value: boolean;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
}
function CheckboxInput(props: CheckboxInputProps) {
    return (
        <div className='input-container'>
            { props.label && <label>{props.label}</label> }
            <input className='input' type="checkbox" checked={props.value} onChange={props.handleInput}/>
        </div>
    )
}

export default CheckboxInput