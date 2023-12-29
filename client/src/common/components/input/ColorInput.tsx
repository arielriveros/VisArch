import React from 'react'
import './Input.css'

interface ColorInputProps {
    targetName: string;
    value: string | number | readonly string[] | undefined
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
}
function ColorInput(props: ColorInputProps) {
    return (
        <div className='input-container'>
            { props.label && <label>{props.label}</label> }
            <input className='input' type="color" value={props.value} onChange={props.handleInput}/>
        </div>
    )
}

export default ColorInput