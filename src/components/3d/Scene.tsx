'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Gallery from './Gallery';

export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 bg-slate-950">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#020617']} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Core Gallery Component */}
        <Gallery />
        
      </Canvas>
    </div>
  );
}
