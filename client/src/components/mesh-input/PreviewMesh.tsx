import { useFrame, useThree } from '@react-three/fiber';
import { Mesh } from 'three';

interface MeshInputProps {
 meshRef: React.MutableRefObject<Mesh | null>;
 rotation: number;
}

export default function PreviewMesh(props: MeshInputProps) {

  const { scene } = useThree();

  useFrame(() => {
    // Rotate scene
    scene.rotation.y = props.rotation;
  });

  return (
    <mesh ref={props.meshRef} />
  );
}
