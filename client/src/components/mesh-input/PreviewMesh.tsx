import { useFrame, useThree } from '@react-three/fiber';
import { Mesh } from 'three';

interface MeshInputProps {
 meshRef: React.MutableRefObject<Mesh | null>;
}

export default function PreviewMesh(props: MeshInputProps) {

  const { scene } = useThree();

  useFrame(() => {
    // Rotate scene
    scene.rotation.y += 0.005;
  });

  return (
    <mesh ref={props.meshRef} />
  );
}
