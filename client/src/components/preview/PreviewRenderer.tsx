import React from 'react'
import { Canvas } from '@react-three/fiber';

export default function PreviewRenderer({ children }: { children: React.ReactNode }) {
  return (
    <Canvas camera={{position: [0, 1, 1]}}>
        <color attach="background" args={['black']} />
        <ambientLight />
        { children }
    </Canvas>
  )
}
