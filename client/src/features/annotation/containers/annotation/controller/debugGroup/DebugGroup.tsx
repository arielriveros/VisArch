import { useEffect, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import { MeshBVHVisualizer } from 'three-mesh-bvh';
import { Perf } from 'r3f-perf'
import { useTaskContext } from "../../../../hooks/useTask";
import DebugBox from "./DebugBox";

type DebugGroupProps = {
	debug: boolean;
	showMonitor: boolean;
	bvhMesh?: Mesh;
}

export default function DebugGroup(props: DebugGroupProps) {
	const { task } = useTaskContext();
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
				return {
					centroid: new Vector3(entity.centroid.x, entity.centroid.y, entity.centroid.z),
					box: {
						min: new Vector3(entity.box.min.x, entity.box.min.y, entity.box.min.z),
						max: new Vector3(entity.box.max.x, entity.box.max.y, entity.box.max.z)
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
