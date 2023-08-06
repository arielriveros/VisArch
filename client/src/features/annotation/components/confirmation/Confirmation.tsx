import React from 'react'
import './Confirmation.css';

type ConfirmationProps = {
    label: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function Confirmation(props: ConfirmationProps) {
  return (
    <div className='confirmation-container'>
        <div className='confirmation-window'>
            <div>
                { props.label }
            </div>
            <div className='confirmation-buttons'>
                <button onClick={props.onConfirm}>Yes</button>
                <button onClick={props.onCancel}>No</button>
            </div>
        </div>
    </div>
  )
}
