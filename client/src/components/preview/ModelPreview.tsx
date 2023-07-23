import { useRef } from 'react';
import { Group } from 'three';

type ModelPreviewProps = {
    modelGroup: Group | null;
}

export function ModelPreview(props: ModelPreviewProps) {
    const groupRef = useRef<Group>(null);
    return (
        <group ref={groupRef}>
            {
                props.modelGroup ? <primitive object={props.modelGroup} /> : null
            }
        </group>
    )
}