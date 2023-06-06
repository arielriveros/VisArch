
interface MeshListItemProps{
    name: string;
    key: string
}

export default function MeshListItem(props: MeshListItemProps): JSX.Element {
    return (
        <div className="MeshListItem" key={props.key}>
            {props.name}
        </div>
    );
}