'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { wallpapers } from '@/lib/data';

const SECTION_HEIGHT = 8; // distance between wallpapers in 3D space

function WallpaperPlane({ url, position, index }: { url: string, position: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState(16 / 9);

  useEffect(() => {
    new THREE.TextureLoader().load(url, (loadedTexture) => {
      loadedTexture.needsUpdate = true;
      loadedTexture.colorSpace = THREE.SRGBColorSpace; // Ensure correct colors
      setTexture(loadedTexture);
      
      if (loadedTexture.image) {
        setAspect(loadedTexture.image.width / loadedTexture.image.height);
      }
    });
  }, [url]);

  useFrame((state) => {
    if (meshRef.current) {
      // Very subtle mouse parallax tilt to make it feel premium but grounded
      const targetRotationX = (state.pointer.y * Math.PI) / 30;
      const targetRotationY = (state.pointer.x * Math.PI) / 30;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.05);
      
      // Static vertical position based on index (no sine wave bouncing)
      meshRef.current.position.y = position[1];
    }
  });

  // Base height is 4 units. Width is calculated by aspect ratio.
  const height = 4.5;
  const width = height * aspect;

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      {texture ? (
        <meshBasicMaterial map={texture} toneMapped={false} />
      ) : (
        <meshBasicMaterial color="#0f172a" /> // slate-900 placeholder while loading
      )}
    </mesh>
  );
}

export default function Gallery() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      // Calculate scroll progress 0 to 1
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      
      // Total height of the 3D gallery
      const total3DHeight = (wallpapers.length - 1) * SECTION_HEIGHT;
      
      // Target position
      const targetY = progress * total3DHeight;
      
      // Smooth interpolation for camera/group position
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {wallpapers.map((wallpaper, i) => (
        <WallpaperPlane
          key={wallpaper.id}
          index={i}
          url={wallpaper.url}
          position={[0, -i * SECTION_HEIGHT, 0]}
        />
      ))}
    </group>
  );
}
