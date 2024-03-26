import { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Archetype, Entity } from '@/api/types';
import { useModel } from '../hooks/useModel';
import { facesToIndex, getCentroidNormalFromFaces } from '../utils/math';
import HighlightMesh from './HighlightMesh';

function LookAtCentroid({faces, zoom}: {faces: number[]; zoom: number}) {
  const { geometry } = useModel();
  const { camera } = useThree();

  useEffect(() => {
    if (!geometry) return;
    const {centroid, normal} = getCentroidNormalFromFaces(faces, geometry);

    camera.position.copy(centroid.clone().add(normal.multiplyScalar(1)));
    camera.lookAt(centroid);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();

  }, [geometry, camera, faces, zoom]);

  return null;
}

export default function ArchetypeViewer({archetype}: {archetype: Archetype}) {
  const { geometry, material} = useModel();
  const [archetypeEntity, setArchetypeEntity] = useState<Entity | null>(null);
  const [zoom, setZoom] = useState(400);

  useEffect(() => {
    const entityId = archetype.archetype;
    const entity = archetype.entities.find(entity => entity.id === entityId);
    setArchetypeEntity(entity || null);
  }, [archetype]);

  return (
    <section>
      <div className='aspect-square bg-gray-800 flex justify-center items-center'>
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: zoom }} frameloop='demand'>
          <ambientLight intensity={5} />
          <pointLight position={[10, 10, 10]} />
          { archetypeEntity && <LookAtCentroid faces={archetypeEntity.faces} zoom={zoom}/>}
          { geometry && material && <mesh geometry={geometry.clone()} material={material.clone()} /> }
          { geometry && archetypeEntity && <HighlightMesh geometry={geometry} indices={facesToIndex(archetypeEntity.faces)} color={archetype.color} />}
        </Canvas>
      </div>
      <input
        className='w-full'
        type='range'
        min='200'
        max='600'
        value={zoom}
        onChange={e => {
          const value = parseInt(e.target.value);
          setZoom(value);
        }}
      />
    </section>
  );
}
