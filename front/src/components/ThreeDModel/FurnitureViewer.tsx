import React, { Suspense, memo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { StandBuilder } from './StandBuilder'

// Preload model
useGLTF.preload('/assets/3d-models/bg.glb')
useGLTF.preload('/assets/3d-models/shadow_man.glb')

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 1.5, 0.8]} />
      <meshStandardMaterial color="#cccccc" opacity={0.5} transparent />
    </mesh>
  )
}

const GLBModel = memo(function GLBModel({
  url,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  color,
  castShadow = true,
  receiveShadow = true,
  forceFlatColor,
  useLambertWhite,
}: {
  url: string
  position?: [number, number, number]
  scale?: number | [number, number, number]
  rotation?: [number, number, number]
  color?: string
  castShadow?: boolean
  receiveShadow?: boolean
  forceFlatColor?: string
  useLambertWhite?: boolean
}) {
  const { scene } = useGLTF(url)

  // Single traversal to apply material overrides, coloring and shadow flags
  React.useEffect(() => {
    if (!scene) return

    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh

        if (forceFlatColor) {
          // Dispose previous material(s) before replacing
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => (mat as THREE.Material).dispose?.())
          } else {
            (mesh.material as THREE.Material)?.dispose?.()
          }
          mesh.material = new THREE.MeshBasicMaterial({ color: forceFlatColor, toneMapped: false })
        } else if (useLambertWhite) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => (mat as THREE.Material).dispose?.())
          } else {
            (mesh.material as THREE.Material)?.dispose?.()
          }
          mesh.material = new THREE.MeshLambertMaterial({ color: '#ffffff' })
        } else if (color) {
          const mat = mesh.material as THREE.Material & { color?: THREE.Color }
          if (mat && 'color' in mat && mat.color instanceof THREE.Color) {
            mat.color.set(color)
          }
        }

        mesh.castShadow = castShadow
        mesh.receiveShadow = receiveShadow
      }
    })
  }, [scene, color, castShadow, receiveShadow, forceFlatColor, useLambertWhite])

  return (
    <primitive
      object={scene}
      position={position as unknown as [number, number, number]}
      scale={
        Array.isArray(scale)
          ? (scale as unknown as [number, number, number])
          : [scale, scale, scale]
      }
      rotation={rotation as unknown as [number, number, number]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
})

const Scene = memo(function Scene({
  width,
  height,
  depth,
  currentPlintHeight,
  selectedColor,
}: {
  width: number
  height: number
  depth: number
  currentPlintHeight: number
  selectedColor: string
}) {
  return (
    <>
      {/* Realistic Interior Lighting Setup */}
      {/* Soft ambient light simulating room lighting */}
      <ambientLight intensity={0.25} color="#f5f5f5" />

      {/* Key light – main directional light simulating window light */}
      <directionalLight
        position={[-80, 200, 150]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        shadow-camera-far={2000}
        shadow-camera-left={-1000}
        shadow-camera-right={1000}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-radius={2}
        color="#fff8f0"
      />

      {/* Fill light – softer light from opposite side */}
      <directionalLight
        position={[150, 180, 100]}
        intensity={1.2}
        color="#e6f3ff"
      />

      {/* Top light – simulating ceiling lighting */}
      <directionalLight
        position={[0, 300, 0]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Rim/back light – subtle separation from background */}
      <directionalLight
        position={[0, 120, -200]}
        intensity={0.3}
        color="#fff8f0"
      />

      {/* Load background & shadow man GLB models */}
      <Suspense fallback={null}>
        <GLBModel
          url="/assets/3d-models/bg.glb"
          position={[0, 0, 0]}
          scale={[100, 45, 45]}
          receiveShadow={true}
          color="#ffffff"
          useLambertWhite={true}
        />
        <GLBModel
          url="/assets/3d-models/shadow_man.glb"
          position={[-100, 0, 2]}
          scale={1}
          color="#ffffff"
          receiveShadow={false}
          forceFlatColor="#ffffff"
        />
      </Suspense>

      {/* Stand Model built from individual components */}
      <Suspense fallback={<LoadingFallback />}>
        <StandBuilder
          selectedColor={selectedColor}
          desiredWidth={width}
          desiredHeight={height}
          desiredDepth={depth}
          desiredPlintHeight={currentPlintHeight}
        />
      </Suspense>
    </>
  )
})

// Main furniture viewer component
interface FurnitureViewerProps {
  selectedColor: string
  width: number
  height: number
  depth: number
  currentPlintHeight: number
}

const FurnitureViewerComponent: React.FC<FurnitureViewerProps> = ({
  width,
  selectedColor,
  height,
  depth,
  currentPlintHeight,
}) => {
  const handleCreated = useCallback(({ gl, scene }: { gl: THREE.WebGLRenderer; scene: THREE.Scene }) => {
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.0
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.shadowMap.autoUpdate = true
    scene.fog = new THREE.Fog('#f9f9f9', 150, 400)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas
        camera={{
          position: [-150, 150, 150],
          fov: 60,
          near: 0.5,
          far: 1000,
        }}
        shadows
        dpr={[1, 1.75]}
        gl={{ powerPreference: 'high-performance' }}
        style={{
          background: 'linear-gradient(135deg, #f9f9f9 0%,#f9f9f9 100%)',
        }}
        onCreated={handleCreated}
      >
        {/* Orbit controls for rotation and zoom */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={250}
          minAzimuthAngle={-Math.PI / 2 + 0.5}
          maxAzimuthAngle={Math.PI / 2 - 0.5}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2 + 0.2}
          target={[0, 50, 0]} // Move scene center down by 50 units to look in the center of the stand
        />

        {/* 3D Scene */}
        <Scene
          depth={depth}
          height={height}
          width={width}
          selectedColor={selectedColor}
          currentPlintHeight={currentPlintHeight}
        />
      </Canvas>
    </div>
  )
}

export const FurnitureViewer = memo(FurnitureViewerComponent)
