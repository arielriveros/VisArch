
interface ButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}
export default function Button({onClick, children}: ButtonProps) {
  return (
    <button className='mx-2 p-1 w-full text-white bg-light-blue border border-blue rounded hover:bg-blue' onClick={onClick}>
      {children}
    </button>
  );
}
