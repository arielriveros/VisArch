import { useState, useEffect } from 'react';
import { BufferGeometry, NormalBufferAttributes } from 'three';

interface HighlightMeshProps {
  geometry: BufferGeometry<NormalBufferAttributes>;
  indices: number[];
  color?: string;
  wireframe?: boolean;
}

export default function HighlightMesh(props: HighlightMeshProps) {
  // TODO: Make this component handle the geometry as a reference, state affects performance but reference is not updated correctly
  const [highlightGeometry, setHighlightGeometry] = useState<BufferGeometry<NormalBufferAttributes>>(props.geometry.clone());

  useEffect(() => {
    const newGeometry = props.geometry.clone();
    newGeometry.setIndex(props.indices);
    newGeometry.index!.needsUpdate = true;
    newGeometry.drawRange.count = props.indices.length;
    setHighlightGeometry(newGeometry);
    return () => {
      newGeometry.dispose();
    };
  }, [props.geometry, props.indices]);

  return (
    <mesh geometry={highlightGeometry} renderOrder={0} visible={props.indices.length > 0}>
      <meshBasicMaterial
        color={props.color || 'red'}
        transparent={true}
        opacity={0.5}
        wireframe={props.wireframe || false}
      />
    </mesh>
  );
}
