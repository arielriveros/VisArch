
interface MeshListItemProps{
    name: string;
}

export default function MeshListItem(props: MeshListItemProps): JSX.Element {
    return (
        <div className="MeshListItem">
            {props.name}
        </div>
    );
}