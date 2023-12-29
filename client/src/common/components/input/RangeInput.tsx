import React from 'react'
import './Input.css'

interface RangeInputProps {
    targetName: string;
    value: number;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;

    min?: number;
    max?: number;
    step?: number;

    label?: string;
}
function RangeInput(props: RangeInputProps) {
    return (
        <div className='input-container'>
            { props.label && <label>{props.label}</label> }
            <input
                className='input'
                type="range"
                min={ props.min || 0 }
                max={ props.max || 1 }
                step={ props.step || 0.1 }
                value={ props.value }
                onChange={ props.handleInput }
            />
        </div>
    )
}

export default RangeInput