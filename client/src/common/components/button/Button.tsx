import './Button.css'

interface ButtonProps {
    text: string;
    class: 'small' | 'medium' | 'large';
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button(props: ButtonProps) {
  return (
    <button className={`Button-${props.class}`} onClick={props.onClick}>
        {props.text}
    </button>
  )
}

export default Button