import { useFrame, useThree } from '@react-three/fiber';
import { Mesh } from 'three';

interface ModelInputProps {
 meshRef: React.MutableRefObject<Mesh | null>;
}

export default function PreviewModel(props: ModelInputProps) {

  const { scene } = useThree();

  useFrame(() => {
    // Rotate scene
    scene.rotation.y += 0.005;
  });

  return (
    <mesh ref={props.meshRef} />
  );
}
