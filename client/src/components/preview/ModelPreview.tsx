import { useRef } from 'react';
import { Group } from 'three';

type ModelPreviewProps = {
    modelGroup: Group;
}

export function ModelPreview(props: ModelPreviewProps) {
    const groupRef = useRef<Group>(null);
    return (
        <group ref={groupRef}>
            <primitive object={props.modelGroup}/>
        </group>
    )
}