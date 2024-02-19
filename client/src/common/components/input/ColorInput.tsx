import React from 'react';
import './Input.css';

interface ColorInputProps {
    targetName: string;
    value: string | number | readonly string[] | undefined;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onColorSelected?: (color: string) => void;
    label?: string;
}
function ColorInput(props: ColorInputProps) {
    const handleColorSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onColorSelected) {
            const selectedColor = e.target.value;
            props.onColorSelected(selectedColor);
        }
    };

    return (
        <div className='input-container'>
            { props.label && <label>{props.label}</label> }
            <input className='input' type="color" value={props.value} onChange={props.handleInput} onBlur={handleColorSelected} />
        </div>
    )
}

export default ColorInput