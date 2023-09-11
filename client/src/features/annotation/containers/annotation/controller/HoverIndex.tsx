import { useEffect } from "react";
import { Mesh } from "three";
import { useThree } from "@react-three/fiber";
import { IntersectionPayload } from "../manager/AnnotationManager";
import { useTaskContext } from "../../../hooks/useTask";
import { calculateBoundingBox } from "../../../utils/boundingBox";

type HoverIndexProps = {
    rate?: number
    mesh: Mesh
}

export default function HoverIndex(props: HoverIndexProps) {
    const { raycaster, scene, gl } = useThree();
    const { selectedEntity, dispatch } = useTaskContext();
    let isThrottled = false;

    const raycast = () => {
        // Perform raycasting and intersection calculations
        raycaster.firstHitOnly = true;
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Get intersection of meshes only
        const meshIntersects = intersects.filter((intersect) => {
            return intersect.object === props.mesh;
        });

        if (meshIntersects.length > 0 ) {
            const intersection: IntersectionPayload = {
                face: meshIntersects[0].face ? meshIntersects[0].face : null,
                faceIndex: meshIntersects[0].faceIndex !== undefined ? meshIntersects[0].faceIndex : null,
            };
            return intersection;
        } else {
            return null;
        }
    }

    useEffect(() => {
        if(!selectedEntity) return;

        const centroid = calculateBoundingBox(selectedEntity.faceIds, props.mesh.geometry).centroid;
        raycaster.ray.origin.set(centroid.x, centroid.y, centroid.z + 5);
        raycaster.ray.direction.set(0, 0, -1);
        const intersection = raycast();

        dispatch({ type: 'SET_INDEX_POSITION', payload: intersection });
    }, [selectedEntity]);

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        if(isThrottled) return;
        isThrottled = true;
    
        const intersection = raycast();
        dispatch({ type: 'SET_INDEX_POSITION', payload: intersection });
    
        // Set a timeout to reset the throttling flag
        setTimeout(() => isThrottled = false, props.rate ?? 1000);
    };

    useEffect(() => {
        gl.domElement.addEventListener('mousemove', handleMouseMove);
        return () => {
            gl.domElement.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return null;
}