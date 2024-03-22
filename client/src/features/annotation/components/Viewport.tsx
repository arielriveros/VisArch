import { Canvas } from '@react-three/fiber';
import ProxyScene from './ProxyScene';
import Emitter from '../utils/emitter';
import CameraController from './CameraController';
import SelectionController from './SelectionController';

export default function Viewport() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 2],
        near: 0.001,
        far: 100
      }}
      onMouseDown={e => Emitter.emit('POINTER_DOWN', e)}
      onMouseUp={e => Emitter.emit('POINTER_UP', e)}
      onMouseMove={e => Emitter.emit('POINTER_MOVE', e)}
      onWheel={e => Emitter.emit('WHEEL', e)}
      onTouchMove={e => Emitter.emit('TOUCH_MOVE', e)}
      onTouchStart={e => Emitter.emit('TOUCH_START', e)}
      onTouchEnd={e => Emitter.emit('TOUCH_END', e)}
      onContextMenu={e => e.nativeEvent.preventDefault()}
    >
      <CameraController />
      <ambientLight />
      <ProxyScene />
      <SelectionController />
    </Canvas>
  );
}
