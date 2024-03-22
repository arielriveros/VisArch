import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useCallback } from 'react';
import Emitter from '../utils/emitter';
import useConfig from '../hooks/useConfig';
import { DirectionalLight, Group, Vector3 } from 'three';

export default function CameraController() {
  const isDownRef = useRef(false);
  const prevTouchRef = useRef({ clientX: 0, clientY: 0 });
  const { tool } = useConfig();
  const toolRef = useRef(tool);

  const { scene, camera } = useThree();

  useEffect(() => {
    const cameraController = new Group();
    cameraController.name = 'CameraController';
    cameraController.add(camera);
    const dirLight = new DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 0, 2);
    camera.add(dirLight); // Camera always will have a light pointing towards the model
    scene?.add(cameraController);
    
  }, [scene, camera]);

  useEffect(() => { toolRef.current = tool; }, [tool]);
    

  const handleMove = useCallback((dx: number, dy: number) => {
    const cameraController = scene?.getObjectByName('CameraController');
    if (!cameraController) return;
    // move right dx and up dy
    const right = new Vector3(1, 0, 0).applyQuaternion(cameraController.quaternion);
    const up = new Vector3(0, 1, 0).applyQuaternion(cameraController.quaternion);

    // move right dx and up dy
    cameraController.position.add(right.multiplyScalar(-dx / 500));
    cameraController.position.add(up.multiplyScalar(dy / 500));
  }, [scene]);

  const handleRotate = useCallback((dx: number, dy: number) => {
    const cameraController = scene?.getObjectByName('CameraController');
    if (!cameraController) return;
    cameraController.rotation.order = 'YXZ';
    cameraController.rotation.x -= dy / 100;
    cameraController.rotation.y -= dx / 100;
  }, [scene]);

  const handleZoom = useCallback((dz: number) => {
    const cameraController = scene?.getObjectByName('CameraController');
    if (!cameraController) return;
    // move right dx and up dy
    const forward = new Vector3(0, 0, 1).applyQuaternion(cameraController.quaternion);

    // move right dx and up dy
    cameraController.position.add(forward.multiplyScalar(-dz / 200));
  }, [scene]);

  const handleReset = useCallback(() => {
    if (!scene || !camera) return;
    const cameraController = scene.getObjectByName('CameraController');
    cameraController?.position.set(0, 0, 0);
    cameraController?.rotation.set(0, 0, 0);
    camera.position.set(0, 0, 2);
  }, [scene, camera]);

  const pointerMoveListener = useCallback(
    (e: MouseEvent) => {
      if (isDownRef.current) {
        const { movementX, movementY } = e;
  
        if (toolRef.current === 'drag' || e.buttons === 2) // Right mouse button always drags
          handleMove(movementX, movementY);
  
        else if (toolRef.current === 'zoom')
          handleZoom(-movementY);
  
        else if (toolRef.current === 'rotate' )
          handleRotate(movementX, movementY);
      }
    }, [handleMove, handleRotate, handleZoom]
  );

  const pointerDownListener = useCallback(() => {
    isDownRef.current = true;
    prevTouchRef.current = { clientX: 0, clientY: 0 };
  }, []);
  
  const pointerUpListener = useCallback(() => {
    isDownRef.current = false;
    prevTouchRef.current = { clientX: 0, clientY: 0 };
  }, []);

  const touchStartListener = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const { clientX, clientY } = e.touches[0];
      prevTouchRef.current = { clientX, clientY };
    }
  }, []);

  const touchMoveListener = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const { clientX, clientY } = e.touches[0];
      const movementX = clientX - prevTouchRef.current.clientX;
      const movementY = clientY - prevTouchRef.current.clientY;

      if (toolRef.current === 'drag')
        handleMove(movementX, movementY);
      else if (toolRef.current === 'rotate')
        handleRotate(movementX, movementY);
      else if (toolRef.current === 'zoom')
        handleZoom(movementY);

      // Update the previous touch position
      prevTouchRef.current = { clientX, clientY };
    }
  }, [handleMove, handleRotate, handleZoom]);

  const wheelListener = useCallback((e: WheelEvent) => {
    handleZoom(-e.deltaY / 10);
  }, [handleZoom]);

  useEffect(() => {
    Emitter.on('POINTER_MOVE', pointerMoveListener);
    Emitter.on('POINTER_DOWN', pointerDownListener);
    Emitter.on('POINTER_UP', pointerUpListener);
    Emitter.on('TOUCH_START', touchStartListener);
    Emitter.on('TOUCH_MOVE', touchMoveListener);
    Emitter.on('WHEEL', wheelListener);
    Emitter.on('RESET', handleReset);

    return () => {
      Emitter.off('POINTER_DOWN', pointerDownListener);
      Emitter.off('POINTER_UP', pointerUpListener);
      Emitter.off('POINTER_MOVE', pointerMoveListener);
      Emitter.off('TOUCH_START', touchStartListener);
      Emitter.off('TOUCH_MOVE', touchMoveListener);
      Emitter.off('WHEEL', wheelListener);
      Emitter.off('RESET', handleReset);
    };
  }, [
    pointerMoveListener,
    pointerDownListener,
    pointerUpListener,
    touchStartListener,
    touchMoveListener,
    wheelListener,
    handleReset
  ]);

  return null;
}
