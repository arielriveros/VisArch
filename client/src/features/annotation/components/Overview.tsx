import { useCallback, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useModel } from '../hooks/useModel';
import { getTriangleFromIndex } from '../utils/math';
import Emitter from '../utils/emitter';
import HighlightGroup from './HighlightGroup';

interface FaceData { a: number, b: number, c: number, normal: Vector3, materialIndex: number }

function OverviewModel() {
  const { geometry, material } = useModel();
  const targetRef = useRef<Vector3>(new Vector3());
  const targetViewRef = useRef<Vector3>(new Vector3());

  useFrame(({ camera }, delta) => {
    camera.position.lerp(targetRef.current, delta * 4);
    camera.lookAt(targetViewRef.current);
  });

  const handleHoverIndex = useCallback((e: {face: FaceData, faceIndex: number}) => {
    const changeView = (newPosition: Vector3, normal: Vector3) => {
      targetViewRef.current = newPosition.clone();
      targetRef.current = newPosition.clone().add(normal);
    };

    if (!e || !geometry) return;
    const { faceIndex } = e;
    const triangle = getTriangleFromIndex(faceIndex, geometry);
    if (!triangle) return;
    const position = triangle.centroid;
    const normal = triangle.normal;
    
    changeView(position, normal);
  }, [geometry]);
  
  useEffect(() => {
    Emitter.on('HOVER_INDEX', handleHoverIndex);
    return () => Emitter.off('HOVER_INDEX', handleHoverIndex);
  }, [geometry, handleHoverIndex]);

  return (
    <group>
      { geometry && material && <mesh geometry={geometry.clone()} material={material.clone()} /> }
      { geometry && <HighlightGroup geometry={geometry.clone()} />}
    </group>
  );
}

export default function Overview() {
  return (
    <div className='absolute bg-slate-700 bg-opacity-50 border'>
      <Canvas camera={{ position: [0, 0, 1.5] }}>
        <ambientLight intensity={2} />
        <OverviewModel />
      </Canvas>
      <svg className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' width='50' height='50'>
        <circle cx='25' cy='25' r='10' fill='none' stroke='white' strokeWidth='1.25' />
      </svg>
      <svg className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' width='50' height='50'>
        <line x1='0' y1='25' x2='50' y2='25' stroke='lightgray' strokeWidth='0.66' />
        <line x1='25' y1='0' x2='25' y2='50' stroke='lightgray' strokeWidth='0.66' />
      </svg>
    </div>
  );
}