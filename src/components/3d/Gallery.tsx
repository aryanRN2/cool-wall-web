'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { wallpapers } from '@/lib/data';

const SECTION_HEIGHT = 8; // distance between wallpapers in 3D space

function WallpaperPlane({ url, position, index }: { url: string, position: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom shader for distortion effect
  const uniforms = useMemo(
    () => ({
      uTexture: { value: new THREE.Texture() },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uHover: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    new THREE.TextureLoader().load(url, (loadedTexture) => {
      loadedTexture.needsUpdate = true;
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTexture.value = loadedTexture;
      }
    });
  }, [url]);

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Subtle bending/wave effect
      float wave = sin(pos.x * 2.0 + uTime) * 0.1;
      float wave2 = cos(pos.y * 2.0 + uTime) * 0.1;
      pos.z += wave + wave2;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      gl_FragColor = texColor;
    }
  `;

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime;
      }
      
      // Subtle float animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
    }
  });

  // Aspect ratio adjustment (assuming standard 16:9 for these images or cover)
  // Let's use 16:9 aspect ratio: 16 * 0.4 = 6.4, 9 * 0.4 = 3.6
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[7, 4, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
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
