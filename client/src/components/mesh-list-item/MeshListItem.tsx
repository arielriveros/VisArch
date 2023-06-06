
interface MeshListItemProps{
    name: string;
}

export default function MeshListItem(props: MeshListItemProps): JSX.Element {
    return (
        <div className="MeshListItem" key={props.name}>
            {props.name}
        </div>
    );
}