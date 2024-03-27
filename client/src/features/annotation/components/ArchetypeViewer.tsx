import { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Archetype, Entity } from '@/api/types';
import { useModel } from '../hooks/useModel';
import { facesToIndex, getCentroidNormalFromFaces } from '../utils/math';
import HighlightMesh from './HighlightMesh';

interface LookAtCentroidProps {
  faces: number[];
  zoom: number;
  scale?: number;
  orientation?: number;
  reflection?: number;
}
function LookAtCentroid({faces, zoom, scale, orientation, reflection}: LookAtCentroidProps) {
  const { geometry } = useModel();
  const { camera } = useThree();

  useEffect(() => {
    if (!geometry) return;
    const {centroid, normal} = getCentroidNormalFromFaces(faces, geometry);

    const _scale = scale || 1;
    const _reflection = reflection || 1;
    const _orientation = (orientation || 0) * _reflection;

    camera.position.copy(centroid.clone().add(normal.multiplyScalar(_reflection)));
    camera.lookAt(centroid);
    // rotate camera z-axis based on orientation
    camera.rotateZ(_orientation * Math.PI / 180);  
    camera.zoom = zoom / _scale;
    camera.updateProjectionMatrix();

  }, [geometry, camera, faces, zoom, scale, orientation, reflection]);

  return null;
}

export default function ArchetypeViewer({archetype, selectedEntity}: {archetype: Archetype; selectedEntity: Entity | null}) {
  const { geometry, material} = useModel();
  const [archetypeEntity, setArchetypeEntity] = useState<Entity | null>(null);
  const [zoom, setZoom] = useState(400);
  const [scale, setScale] = useState(1);
  const [reflection, setReflection] = useState(1);
  const [orientation, setOrientation] = useState(1);

  useEffect(() => {
    const entityId = archetype.archetype;
    const entity = archetype.entities.find(entity => entity.id === entityId);
    setArchetypeEntity(entity || null);
  }, [archetype]);

  useEffect(() => {
    if (!selectedEntity) return;
    setScale(selectedEntity.scale);
    setOrientation(selectedEntity.orientation);
    setReflection(selectedEntity.reflection ? -1 : 1);
  }, [selectedEntity]);

  return (
    <section className='w-full'>
      <div className='aspect-square flex pointer-events-none'>
        <div className='w-full h-full relative'>
          <div className='w-full h-full absolute flex items-center justify-center'>
            <Canvas orthographic camera={{ position: [0, 0, 1], zoom: zoom }} frameloop='demand'>
              <ambientLight intensity={5} />
              <pointLight position={[10, 10, 10]} />
              { archetypeEntity && <LookAtCentroid faces={archetypeEntity.faces} zoom={zoom}/>}
              { geometry && material && <mesh geometry={geometry.clone()} material={material.clone()} /> }
              { geometry && archetypeEntity && <HighlightMesh geometry={geometry} indices={facesToIndex(archetypeEntity.faces)} color={archetype.color} />}
            </Canvas>
          </div>
          <div className='w-full h-full absolute flex items-center justify-center'>
            <Canvas orthographic camera={{ position: [0, 0, 1], zoom: zoom }} frameloop='demand' >
              <ambientLight intensity={5} />
              <pointLight position={[10, 10, 10]} />
              { selectedEntity &&
              <LookAtCentroid
                faces={selectedEntity.faces}
                zoom={zoom}
                scale={scale}
                orientation={orientation}
                reflection={reflection}/>
              }
              { geometry && selectedEntity && <HighlightMesh geometry={geometry} indices={facesToIndex(selectedEntity.faces)} wireframe/>}
            </Canvas>
          </div>
        </div>
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
