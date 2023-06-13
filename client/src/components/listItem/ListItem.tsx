import './ListItem.css';

export interface ListItemProps{
    text: string;
    onClick: () => void;
}

export default function ListItem(props: ListItemProps): JSX.Element {
    return (
        <div className="va-list-item" onClick={()=>{ props.onClick() }}>
            {props.text}
        </div>
    );
}