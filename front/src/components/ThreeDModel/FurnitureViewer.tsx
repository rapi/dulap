import React, { Suspense, useEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Plane } from '@react-three/drei'
import { StandBuilder } from './StandBuilder'
import * as THREE from 'three'


/*
 * Legacy StandModel implementation has been removed in favour of StandBuilder.
 * Keeping commented block for reference during transition. Once all stand
 * components are rebuilt, this block can be deleted entirely.
 */

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 1.5, 0.8]} />
      <meshStandardMaterial color="#cccccc" opacity={0.5} transparent />
    </mesh>
  )
}

// Floor plane with high-quality Polyhaven wood laminate textures
function Floor() {
  const diffuseMap = useLoader(THREE.TextureLoader, 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/laminate_floor_02/laminate_floor_02_diff_1k.jpg')
  const normalMap = useLoader(THREE.TextureLoader, 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/laminate_floor_02/laminate_floor_02_nor_gl_1k.jpg')
  const roughnessMap = useLoader(THREE.TextureLoader, 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/laminate_floor_02/laminate_floor_02_rough_1k.jpg')

  // Configure texture properties for realistic wood appearance
  useEffect(() => {
    [diffuseMap, normalMap, roughnessMap].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(4, 4) // Repeat texture 4x4 times across the floor
      texture.anisotropy = 16 // Better texture quality at angles
    })
  }, [diffuseMap, normalMap, roughnessMap])

  return (
    <Plane
      args={[10, 10]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <meshStandardMaterial 
        map={diffuseMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        roughness={0.8}
        metalness={0.0}
      />
    </Plane>
  )
}

// Wall behind the stand with high-quality beige plaster texture
function Wall() {
  // Load textures from PolyHaven
  const wallDiffuse = useLoader(
    THREE.TextureLoader,
    'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/beige_wall_001/beige_wall_001_diff_1k.jpg'
  )
  const wallNormal = useLoader(
    THREE.TextureLoader,
    'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/beige_wall_001/beige_wall_001_nor_gl_1k.jpg'
  )
  const wallRoughness = useLoader(
    THREE.TextureLoader,
    'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/beige_wall_001/beige_wall_001_rough_1k.jpg'
  )

  // Configure texture tiling & quality once they are loaded
  useEffect(() => {
    // Ensure diffuse is interpreted in sRGB colour-space so it doesn't render too dark
    wallDiffuse.colorSpace = THREE.SRGBColorSpace;

    const repeatX = 8; // plane width
    const repeatY = 6; // plane height

    [wallDiffuse, wallNormal, wallRoughness].forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY); // match plane aspect so no stretching
      tex.anisotropy = 16;
    });
  }, [wallDiffuse, wallNormal, wallRoughness])

  return (
    <Plane
      args={[8, 6]}
      position={[0, 2, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        map={wallDiffuse}
        normalMap={wallNormal}
        roughnessMap={wallRoughness}
        color="#f8f4e9" // light beige tint to lift overall brightness
        roughness={0.9}
        metalness={0.0}
      />
    </Plane>
  )
}

// Scene component
function Scene({ width }: { width?: number }) {
  return (
    <>
      {/* Realistic Interior Lighting Setup */}
      {/* Soft ambient light simulating room lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Main directional light simulating window light */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#ffffff"
      />
      
      {/* Soft fill light from opposite side */}
      <directionalLight
        position={[-3, 4, 2]}
        intensity={0.8}
        color="#f0f8ff"
      />
      
      {/* Subtle rim light for depth */}
      <directionalLight
        position={[0, 2, -4]}
        intensity={0.5}
        color="#fff8f0"
      />
      
      {/* Wall behind the stand */}
      <Wall />
      
      {/* Floor with wood textures */}
      <Floor />
      
      {/* Stand Model built from individual components */}
      <Suspense fallback={<LoadingFallback />}>
        <StandBuilder desiredWidth={width ?? 80} />
      </Suspense>
    </>
  )
}

// Main furniture viewer component
interface FurnitureViewerProps {
  width?: number
}

export const FurnitureViewer: React.FC<FurnitureViewerProps> = ({ width }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas
        camera={{ 
          position: [3, 2, 3], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
        style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1 // slightly darker
        }}
      >
        {/* Orbit controls for rotation and zoom */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* 3D Scene */}
        <Scene width={width} />
      </Canvas>
    </div>
  )
} 