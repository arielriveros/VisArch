import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Vector3 } from "three";
import { useTaskContext } from "../../../hooks/useTask";
import { useProxyMeshContext } from "../../../hooks/useProxyMesh";

export default function LookAtIndex() {
	const { camera } = useThree();
	const { proxyGeometry } = useProxyMeshContext();
	const { indexPosition } = useTaskContext();
	const [target, setTarget] = useState<Vector3>(new Vector3());

	const getPosition = (face: {a: number, b: number, c: number, normal: Vector3}) => {
		const { a, b, c } = face;
		if (!proxyGeometry) return null;

		const vertices = proxyGeometry.attributes.position.array;
		const x = (vertices[a * 3] + vertices[b * 3] + vertices[c * 3]) / 3;
		const y = (vertices[a * 3 + 1] + vertices[b * 3 + 1] + vertices[c * 3 + 1]) / 3;
		const z = (vertices[a * 3 + 2] + vertices[b * 3 + 2] + vertices[c * 3 + 2]) / 3;

		return new Vector3(x, y, z);
	}

	useFrame(({ camera }, delta) => {
		camera.position.lerp(target, delta * 5)
		camera.lookAt(0, 0, 0);
	})

	const changeView = (newPosition: Vector3) => {
		const newTarget = new Vector3(newPosition.x, newPosition.y, newPosition.z);
		newTarget.multiplyScalar(2);
		setTarget(newTarget);
	}

	useEffect(() => {
		if (!indexPosition) return;
		const { face } = indexPosition;
		
		if (!face) return;
		const position = getPosition(face);

		if (position) 
			changeView(position);
	} , [indexPosition, camera]);

	return null;
}