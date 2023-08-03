import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { IntersectionPayload } from "../manager/AnnotationManager";
import { Mesh } from "three";

type HoverIndexProps = {
    handleHover: (index: IntersectionPayload | null) => void,
    rate?: number
}

export default function HoverIndex(props: HoverIndexProps) {
    const { raycaster, scene, gl } = useThree();
    let isThrottled = false;

    const raycast = () => {
        // Perform raycasting and intersection calculations
        raycaster.firstHitOnly = true;
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Get intersection of meshes only
        const meshIntersects = intersects.filter((intersect) => {
            return intersect.object instanceof Mesh;
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

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        if(isThrottled) return;
        isThrottled = true;
    
        const intersection = raycast();
        props.handleHover(intersection);
    
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