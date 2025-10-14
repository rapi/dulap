import React, { Suspense, memo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { GLBModel } from './GLBModel'
import { SceneLights } from './SceneLights'
import * as THREE from 'three'
import { StandBuilder } from './StandBuilder'
import { OpeningType } from './furnitureConfig'
import { ColumnType } from './parts/Column'

// Preload models
useGLTF.preload('/assets/3d-models/bg.glb')
useGLTF.preload('/assets/3d-models/shadow_man.glb')

function ModelLoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 1.5, 0.8]} />
      <meshStandardMaterial color="#cccccc" opacity={0.5} transparent />
    </mesh>
  )
}

const FurnitureScene = memo(function FurnitureScene({
  width,
  height,
  depth,
  currentPlintHeight,
  selectedColor,
  sections,
  openingType,
  columns,
  columnConfigurations,
}: {
  width: number
  height: number
  depth: number
  currentPlintHeight: number
  selectedColor: string
  sections: number
  openingType: OpeningType
  columns: number
  columnConfigurations?: ColumnType[]
}) {
  return (
    <>
      <SceneLights
        enableShadows={true}
        ambientLightIntensity={0.25}
        shadowQuality="high"
      />

      {/* Load background & shadow man GLB models */}
      <Suspense fallback={null}>
        <GLBModel
          modelUrl="/assets/3d-models/bg.glb"
          modelPosition={[0, 0, 0]}
          modelScale={[100, 45, 45]}
          shouldReceiveShadow={true}
          overrideColorHex="#ffffff"
          useLambertWhiteMaterial={true}
        />
        <GLBModel
          modelUrl="/assets/3d-models/shadow_man.glb"
          modelPosition={[-100, 0, 2]}
          modelScale={1}
          overrideColorHex="#ffffff"
          shouldReceiveShadow={false}
          forceFlatColorHex="#ffffff"
        />
      </Suspense>

      {/* Stand Model built from individual components */}
      <Suspense fallback={<ModelLoadingFallback />}>
        <StandBuilder
          selectedColor={selectedColor}
          desiredWidth={width}
          desiredHeight={height}
          desiredDepth={depth}
          desiredPlintHeight={currentPlintHeight}
          sectionsCount={sections}
          openingType={openingType}
          columns={columns}
          columnConfigurations={columnConfigurations}
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
  sections: number
  openingType: OpeningType
  columns: number
  columnConfigurations?: ColumnType[]
}

const FurnitureViewerComponent: React.FC<FurnitureViewerProps> = ({
  width,
  selectedColor,
  height,
  depth,
  currentPlintHeight,
  sections,
  openingType,
  columns,
  columnConfigurations,
}) => {
  const handleCanvasCreated = useCallback(
    ({
      gl: webGlRenderer,
      scene: threeScene,
    }: {
      gl: THREE.WebGLRenderer
      scene: THREE.Scene
    }) => {
      webGlRenderer.outputColorSpace = THREE.SRGBColorSpace
      webGlRenderer.toneMapping = THREE.ACESFilmicToneMapping
      webGlRenderer.toneMappingExposure = 1.0
      webGlRenderer.shadowMap.enabled = true
      webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
      webGlRenderer.shadowMap.autoUpdate = true
      threeScene.fog = new THREE.Fog('#f9f9f9', 300, 400)
    },
    []
  )

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas
        camera={{
          position: [0, 50, 250],
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
        onCreated={handleCanvasCreated}
      >
        {/* Orbit controls for rotation and zoom */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={false}
          dampingFactor={0}
          // minDistance={100}
          // maxDistance={250}
          // minAzimuthAngle={-Math.PI / 2 + 0.5}
          // maxAzimuthAngle={Math.PI / 2 - 0.5}
          // minPolarAngle={0.3}
          // maxPolarAngle={Math.PI / 2 + 0.2}
          target={[0, 50, 0]} // Move scene center down by 50 units to look in the center of the scene
        />

        {/* 3D Scene */}
        <FurnitureScene
          depth={depth}
          height={height}
          width={width}
          selectedColor={selectedColor}
          currentPlintHeight={currentPlintHeight}
          sections={sections}
          openingType={openingType}
          columns={columns}
          columnConfigurations={columnConfigurations}
        />
      </Canvas>
    </div>
  )
}

export const FurnitureViewer = memo(FurnitureViewerComponent)
