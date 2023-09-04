import { useEffect, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import { MeshBVHVisualizer } from 'three-mesh-bvh';
import { Perf } from 'r3f-perf'
import { useTaskContext } from "../../../../hooks/useTask";
import { useProxyMeshContext } from "../../../../hooks/useProxyMesh";
import { calculateBoundingBox } from "../../../../utils/boundingBox";
import DebugBox from "./DebugBox";

type DebugGroupProps = {
	debug: boolean;
	showMonitor: boolean;
	bvhMesh?: Mesh;
}

export default function DebugGroup(props: DebugGroupProps) {
	const { task } = useTaskContext();
	const { unwrappedGeometry } = useProxyMeshContext();
	const [boxes, setBoxes] = useState<{centroid: Vector3; box: {min: Vector3, max: Vector3}}[]>([]);
	const bvhMeshRef = useRef<Group>(new Group());

	useEffect(() => {
		if(!props.debug) return;
		if (!props.bvhMesh) return;
		const visualizer = new MeshBVHVisualizer(props.bvhMesh, 0xff0000);
		bvhMeshRef.current.add(visualizer);
		
	}, [props.bvhMesh]);

	useEffect(() => {
		if(!props.debug) return;
		if (!task || !task.annotations) return;
		const newBoxes = task.annotations.flatMap(archetype => {
			return archetype.entities.map(entity => {
				if (!unwrappedGeometry) return {centroid: new Vector3(), box: {min: new Vector3(), max: new Vector3()}};
				let boundingBox = calculateBoundingBox(entity.faceIds, unwrappedGeometry);

				return {
					centroid: new Vector3(boundingBox.centroid.x, boundingBox.centroid.y, boundingBox.centroid.z),
					box: {
						min: new Vector3(boundingBox.boundingBox.min.x, boundingBox.boundingBox.min.y, boundingBox.boundingBox.min.z),
						max: new Vector3(boundingBox.boundingBox.max.x, boundingBox.boundingBox.max.y, boundingBox.boundingBox.max.z)
					}
				}
			})
		})
		setBoxes(newBoxes);

	}, [task?.annotations]);
	return (
		<group visible={props.debug}>
			{boxes.map((box, index) => 
				<DebugBox key={index} centroid={box.centroid} box={box.box} color={'#ff0000'} />
			)}
			{props.bvhMesh &&
				<group ref={bvhMeshRef} />
			}
			{
				props.showMonitor &&
				<Perf
					openByDefault
					trackGPU={true}
					position={'bottom-left'}
					overClock={true}
					deepAnalyze={true}
				/>
			}
		</group>
	)
}
