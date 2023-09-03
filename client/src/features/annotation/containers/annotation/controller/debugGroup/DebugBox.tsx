import { Vector3 } from 'three'

type DebugBoxProps = {
    centroid: Vector3;
    box: {min: Vector3, max: Vector3};
    color: string;
}

export default function DebugBox(props: DebugBoxProps) {

    const { centroid, box, color } = props;

    return (
		<mesh position={centroid}>
			<boxGeometry args={[box.max.x - box.min.x, box.max.y - box.min.y, box.max.z]} />
			<meshBasicMaterial color={color} wireframe={true} />
		</mesh>
    )
}
