import { useRef, useEffect } from "react";
import { BufferGeometry, NormalBufferAttributes } from "three";
import { useTaskContext } from "../../../hooks/useTask";

type SelectionHighlightMeshProps = {
    geometry: BufferGeometry<NormalBufferAttributes>;
    color: string;
    wireframe: boolean;
}
export default function SelectionHighlightMesh(props: SelectionHighlightMeshProps) {
    const { selectedIndices } = useTaskContext();
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
        if (!selectedIndices) return;
        highlightIndices(selectedIndices);

    }, [selectedIndices]);

    return (
        <group>
            <mesh geometry={geometryRef.current}>
                <meshBasicMaterial
                    color={props.color}
                    transparent={true}
                    opacity={0.5}
                    side={0}/>
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
