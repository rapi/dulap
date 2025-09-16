import React, { Suspense, useEffect } from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Plane, useGLTF } from '@react-three/drei'
import { StandBuilder2 } from './StandBuilder2'
import * as THREE from 'three'
import { StandBuilder } from './StandBuilder'
import { GLTFLoader } from 'three-stdlib'

// Helper to force flat, unlit white material on every mesh in the provided scene
function forceFlatWhite(scene: THREE.Object3D, hex = '#ffffff') {
  scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      const mesh = o as THREE.Mesh
      const newMat = new THREE.MeshBasicMaterial({ color: hex, toneMapped: false })
      // Dispose previous material(s) to free GPU memory
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => (mat as THREE.Material).dispose?.())
      } else {
        (mesh.material as THREE.Material)?.dispose?.()
      }
      mesh.material = newMat
      mesh.castShadow = false // prevents any shadow tinting
      mesh.receiveShadow = false
    }
  })
}

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Generic component for loading and displaying external GLB/GLTF models
function GLBModel({
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
  receiveShadow?: boolean,
  forceFlatColor?: string,
  useLambertWhite?: boolean,
}) {
  // Drei's useGLTF automatically caches geometry & materials on subsequent calls
  // const { scene } = useGLTF(url)
      const { scene }  = useLoader(GLTFLoader, url) 

  // Apply provided color to all mesh materials
  React.useEffect(() => {
    if (color && scene) {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          const material = mesh.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | THREE.MeshPhongMaterial | THREE.MeshLambertMaterial
          if (material && material.color) {
            material.color.set(color)
          }
        }
      })
    }
  }, [color, scene])
  // Replace materials with MeshLambertMaterial if requested
  React.useEffect(() => {
    if (scene && useLambertWhite) {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          // Dispose the old material(s)
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => (mat as THREE.Material).dispose?.())
          } else {
            (mesh.material as THREE.Material)?.dispose?.()
          }
          mesh.material = new THREE.MeshLambertMaterial({ color: '#ffffff' })
        }
      })
    }
  }, [scene, useLambertWhite])

  React.useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene)
      const size = new THREE.Vector3()
      box.getSize(size)

    }
    // Apply flat white material specifically to shadow_man model
    if (scene && forceFlatColor) {
      forceFlatWhite(scene, forceFlatColor)
    }
  }, [scene, url])
  React.useEffect(() => {
    if (scene) {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          mesh.castShadow = castShadow
          mesh.receiveShadow = receiveShadow
        }
      })
    }
  }, [scene, castShadow, receiveShadow])
  

  return (
    <primitive
      object={scene}
      position={position as unknown as [number, number, number]}
      scale={Array.isArray(scale) ? (scale as unknown as [number, number, number]) : [scale, scale, scale]}
      rotation={rotation as unknown as [number, number, number]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
}

// Scene component
function Scene({ width, height, depth, currentPlintHeight, selectedColor }: { width: number, height: number, depth: number, currentPlintHeight: number, selectedColor: string }) {
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
        {/* const fbx = useLoader(FBXLoader, '/assets/stand.fbx') */}

      {/* Load background & shadow man GLB models */}
      <Suspense fallback={null}>
        <GLBModel 
          url="/assets/3d-models/bg.glb" 
          position={[0, 0, 0]} 
          scale={[100,45,45]} 
          receiveShadow={true}
          color='#ffffff'
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
        <StandBuilder selectedColor={selectedColor} desiredWidth={width} desiredHeight={height} desiredDepth={depth} desiredPlintHeight={currentPlintHeight}/>
      </Suspense>
    </>
  )
}

// Main furniture viewer component
interface FurnitureViewerProps {
  selectedColor: string
  width: number
  height: number
  depth: number
  currentPlintHeight: number
}

export const FurnitureViewer: React.FC<FurnitureViewerProps> = ({ width, selectedColor, height, depth, currentPlintHeight}) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas
        camera={{ 
          position: [-150, 150, 150], 
          fov: 60,
          near: 0.5,
          far: 1000
        }}
        shadows
        style={{ background: 'linear-gradient(135deg, #f9f9f9 0%,#f9f9f9 100%)' }}
        onCreated={({ gl, scene }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0 // slightly brighter for whiter wall while keeping shadows
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          gl.shadowMap.autoUpdate = true
          
          // Add fog to create atmospheric depth and fade background
          scene.fog = new THREE.Fog('#f9f9f9', 150, 400)
        }}
      >
        {/* Orbit controls for rotation and zoom */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={250}
          minAzimuthAngle={-Math.PI/2 + 0.5}
          maxAzimuthAngle={Math.PI/2 - 0.5}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI/2+0.2}
          target={[0, 50, 0]} // Move scene center down by 50 units
        />
        
        {/* 3D Scene */}
        <Scene depth={depth} height={height} width={width} selectedColor={selectedColor} currentPlintHeight={currentPlintHeight}/>
      </Canvas>
    </div>
  )
} 