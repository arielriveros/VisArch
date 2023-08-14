import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Vector3 } from "three";
import { useIndicesContext } from "../../../hooks/useIndices";
import { useProxyMeshContext } from "../../../hooks/useProxyMesh";

export default function LookAtIndex() {
	const { camera } = useThree();
	const { proxyGeometry } = useProxyMeshContext();
	const { indexPosition } = useIndicesContext();

	const getPosition = (face: {a: number, b: number, c: number, normal: Vector3}) => {
		const { a, b, c } = face;
		if (!proxyGeometry) return null;

		const vertices = proxyGeometry.attributes.position.array;
		const x = (vertices[a * 3] + vertices[b * 3] + vertices[c * 3]) / 3;
		const y = (vertices[a * 3 + 1] + vertices[b * 3 + 1] + vertices[c * 3 + 1]) / 3;
		const z = (vertices[a * 3 + 2] + vertices[b * 3 + 2] + vertices[c * 3 + 2]) / 3;

		return new Vector3(x, y, z);
	}

	const changeView = (newPosition: Vector3) => {
		camera.position.set(newPosition.x, newPosition.y, newPosition.z);
		camera.position.multiplyScalar(2);
		camera.lookAt(0, 0, 0);
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