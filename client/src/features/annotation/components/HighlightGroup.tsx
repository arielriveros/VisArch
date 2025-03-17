import { useEffect, useState } from 'react';
import { BufferGeometry, NormalBufferAttributes } from 'three';
import useAnnotation from '../hooks/useAnnotation';
import HighlightMesh from './HighlightMesh';
import { facesToIndex } from '../utils/math';
import Emitter from '../utils/emitter';

interface HighlightGroupProps {
  geometry: BufferGeometry<NormalBufferAttributes>;
}

export default function HighlightGroup(props: HighlightGroupProps) {
  const { annotations } = useAnnotation();
  const [highlightFaces, setHighlightFaces] = useState<number[]>([]);

  useEffect(() => {
    const highlight = (faces: number[]) => { setHighlightFaces(faces); };
    Emitter.on('HIGHLIGHT_FACES', highlight);
    return () => Emitter.off('HIGHLIGHT_FACES', highlight);
  }, []);

  return (
    <group>
      <HighlightMesh geometry={props.geometry} indices={facesToIndex(highlightFaces)} color='blue' wireframe />
      {annotations?.map(archetype => (
        <HighlightMesh
          key={archetype.id}
          geometry={props.geometry}
          indices={facesToIndex(archetype.entities.map(entity=> entity.faces).flat())}
          color={archetype.color}
        />
      ))}
    </group>
  );
}
