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

  return (
    <div className='flex justify-center w-full'> { !confirming ?
      <button disabled={props.disabled} className='bg-blue rounded-md p-1 mt-3 m-2 w-full' onClick={ () => setConfirming(true) }>{props.label}</button>
      :
      <>
        <button disabled={props.disabled} className='bg-red-400 rounded-md p-1 mt-3 m-2' onClick={ () => setConfirming(false) }>Cancel</button>
        <button disabled={props.disabled} className='bg-green-400 rounded-md p-1 mt-3 m-2' onClick={ (e) => { setConfirming(false); props.onConfirm(e); }}>Confirm</button>
      </>
    }</div>
  );
}