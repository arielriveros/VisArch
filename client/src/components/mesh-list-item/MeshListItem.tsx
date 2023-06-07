import { ModelSource } from "../renderer/Renderer";

interface MeshListItemProps{
    name: string;
    setModelCallback: (newModelSrc: ModelSource) => void;
}

export default function MeshListItem(props: MeshListItemProps): JSX.Element {
    return (
        <div className="MeshListItem" onClick={()=>{props.setModelCallback({
            obj: `http://localhost:5000/meshFiles/${props.name}/${props.name}.obj`,
            mtl: `http://localhost:5000/meshFiles/${props.name}/${props.name}.obj.mtl`,
            tex: ""
        })}}>
            {props.name}
        </div>
    );
}