import { useRef, useEffect } from "react";
import { BufferGeometry, MeshBasicMaterial, NormalBufferAttributes } from "three";
import { useTaskContext } from "../../../hooks/useTask";
import { useFrame } from "@react-three/fiber";

type SelectionHighlightMeshProps = {
    geometry: BufferGeometry<NormalBufferAttributes>;
    color: string;
    wireframe: boolean;
}

function PulseMaterial(props: {color: string}) {
    const { color } = props;

    const pulseMaterial = useRef<MeshBasicMaterial>(new MeshBasicMaterial({ color, transparent: true, opacity: 0.5, side: 0 }));

    useFrame((state, delta) => {
        let alpha = state.clock.getElapsedTime();
        let opacity = Math.sin(alpha * 3) / 2 + 1;
        pulseMaterial.current.opacity = opacity;
        pulseMaterial.current.needsUpdate = true;
    });

    return(
        <meshBasicMaterial
            ref={pulseMaterial}
            color={color}
            transparent={true}
            side={0} />
    )
}

export default function SelectionHighlightMesh(props: SelectionHighlightMeshProps) {
    const { selectedEntity } = useTaskContext();
    const geometryRef = useRef<BufferGeometry<NormalBufferAttributes>>(new BufferGeometry());

    const highlightIndices = (indicesToHighlight: number[]) => {
        let newIndices: number[] = [];
        for (let i = 0; i < indicesToHighlight.length; i++) {
            const index = indicesToHighlight[i] * 3;
            const a = index + 0;
            const b = index + 1;
            const c = index + 2;
            newIndices.push(a, b, c);
        }

        const indexAttr = props.geometry.index;
        const newIndexAttr = geometryRef.current.index;
        // update the highlight mesh
        for ( let i = 0, l = newIndices.length; i < l; i ++ ) {
            const ix = indexAttr?.getX( newIndices[i] );
            newIndexAttr?.setX( i, ix as number );
        }

        geometryRef.current.drawRange.count = newIndices.length;
        if (newIndexAttr)
            newIndexAttr.needsUpdate = true;
    }

    useEffect(() => {
        geometryRef.current.drawRange.count = 0;
        geometryRef.current.setAttribute('position', props.geometry.clone().getAttribute('position'));
        geometryRef.current.setIndex(props.geometry.clone().index);
    }, []);

    useEffect(() => {
        highlightIndices(selectedEntity?.faceIds || []);

    }, [selectedEntity]);

    return (
        <group renderOrder={10}>
            <mesh geometry={geometryRef.current} >
                <PulseMaterial color={props.color}/>
            </mesh>
            { props.wireframe &&
                <mesh geometry={geometryRef.current}>
                    <meshBasicMaterial
                        color={props.color}
                        wireframe={true}
                        wireframeLinecap="round"
                        side={0}/>
                </mesh>
            }
        </group>
    )
}
