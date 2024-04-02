import { useState } from 'react';

interface ConfirmButtonProps {
  label: string;
  // TODO: type the event correctly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: (e: any) => void;
  disabled?: boolean;
}
export default function ConfirmButton(props: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  return (!confirming ?
    <button disabled={props.disabled} className='mx-1 p-1 w-full text-white bg-light-blue border border-blue rounded hover:bg-blue' onClick={ () => setConfirming(true) }>
      {props.label}
    </button>
    :
    <div className='flex justify-center w-full'> 
      <button disabled={props.disabled} className='mx-1 p-1 w-full bg-red-400 rounded-md' onClick={ () => setConfirming(false) }>Cancel</button>
      <button disabled={props.disabled} className='mx-1 p-1 w-full bg-green-400 rounded-md' onClick={ (e) => { setConfirming(false); props.onConfirm(e); }}>Confirm</button>
    </div>
  );
}