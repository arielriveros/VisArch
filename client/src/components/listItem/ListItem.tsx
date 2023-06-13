export interface ListItemProps{
    text: string;
    onClick: () => void;
}

export default function ListItem(props: ListItemProps): JSX.Element {
    return (
        <div className="list-item" onClick={()=>{ props.onClick() }}>
            {props.text}
        </div>
    );
}