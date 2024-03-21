import { useCallback, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import Emitter from '../utils/emitter';

type HoverIndexProps = {
  rate?: number;
}

export default function HoverIndex(props: HoverIndexProps) {
  const { raycaster, scene, gl } = useThree();
  const isThrottledRef = useRef(false);

  const raycast = useCallback(() => {
    const proxy = scene?.getObjectByName('proxy');
    if (!proxy) return null;
    // Perform raycasting and intersection calculations
    raycaster.firstHitOnly = true;
    const intersects = raycaster.intersectObject(proxy, false);

    // If there are intersections, return the first one
    if (intersects.length > 0 ) {
      const intersection = {
        face: intersects[0].face ? intersects[0].face : null,
        faceIndex: intersects[0].faceIndex !== undefined ? intersects[0].faceIndex : null,
      };
      return intersection;
    }
    
    return null;
  }, [raycaster, scene]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();

    if(isThrottledRef.current) return;
    isThrottledRef.current = true;
    
    const intersection = raycast();
    Emitter.emit('HOVER_INDEX', intersection);
    
    // Set a timeout to reset the throttling flag
    setTimeout(() => isThrottledRef.current = false, props.rate ?? 1000);
  }, [raycast, props.rate]);

  useEffect(() => {
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    gl.domElement,
    handleMouseMove,
    props.rate
  ]);

  return null;
}