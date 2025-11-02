import React, { Suspense, memo, useCallback, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { GLBModel } from './GLBModel'
import { SceneLights } from './SceneLights'
import * as THREE from 'three'
import { Furniture3DProps } from '~/types/furniture3D'
import { FurnitureBuilder } from './FurnitureBuilder'
import { WardrobeBuilder } from './WardrobeBuilder'
import { getViewerConfig } from './furnitureViewerConfig'
import styles from './FurnitureViewer.module.css'

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
  columnWidths,
  columnPositions,
  furnitureType,
}: Furniture3DProps) {
  const config = getViewerConfig(furnitureType)
  const { gl } = useThree()
  
  // Trigger shadow update when furniture dimensions or configuration changes
  // Since autoUpdate is disabled, we manually trigger updates only when needed
  useEffect(() => {
    if (gl.shadowMap.enabled && !gl.shadowMap.autoUpdate) {
      gl.shadowMap.needsUpdate = true
    }
  }, [
    width,
    height,
    depth,
    currentPlintHeight,
    columns,
    columnWidths,
    columnPositions,
    columnConfigurations,
    gl,
  ])
  
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
          modelScale={config.backgroundScale}
          shouldReceiveShadow={true}
          overrideColorHex="#ffffff"
          useLambertWhiteMaterial={true}
        />
        <GLBModel
          modelUrl="/assets/3d-models/shadow_man.glb"
          modelPosition={[config.getShadowManXPosition(width), 0, 2]}
          modelScale={[1, 1, 1]}
          overrideColorHex="#ffffff"
          shouldReceiveShadow={false}
          forceFlatColorHex="#ffffff"
        />
      </Suspense>

      {/* Furniture Model built from individual components */}
      <Suspense fallback={<ModelLoadingFallback />}>
        {furnitureType === 'wardrobe' ? (
          <WardrobeBuilder
            selectedColor={selectedColor}
            desiredWidth={width}
            desiredHeight={height}
            desiredDepth={depth}
            desiredPlintHeight={currentPlintHeight}
            sectionsCount={sections}
            openingType={openingType}
            columns={columns}
            columnConfigurations={columnConfigurations}
            columnWidths={columnWidths}
            columnPositions={columnPositions}
          />
        ) : (
          <FurnitureBuilder
            selectedColor={selectedColor}
            desiredWidth={width}
            desiredHeight={height}
            desiredDepth={depth}
            desiredPlintHeight={currentPlintHeight}
            sectionsCount={sections}
            openingType={openingType}
            columns={columns}
            columnConfigurations={columnConfigurations}
            columnWidths={columnWidths}
            columnPositions={columnPositions}
          />
        )}
      </Suspense>
    </>
  )
})

// Main furniture viewer component uses Furniture3DProps
const FurnitureViewerComponent: React.FC<Furniture3DProps> = ({
  width,
  selectedColor,
  height,
  depth,
  currentPlintHeight,
  sections,
  openingType,
  columns,
  columnConfigurations,
  columnWidths,
  columnPositions,
  furnitureType,
}) => {
  const handleCanvasCreated = useCallback(
    ({
      gl: webGlRenderer,
    }: {
      gl: THREE.WebGLRenderer
      scene: THREE.Scene
    }) => {
      webGlRenderer.outputColorSpace = THREE.SRGBColorSpace
      webGlRenderer.toneMapping = THREE.ACESFilmicToneMapping
      webGlRenderer.toneMappingExposure = 1.0
      webGlRenderer.shadowMap.enabled = true
      webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
      
      // Performance optimization: Disable automatic shadow updates
      // Shadows only need to update when furniture geometry/position changes
      // This saves significant GPU resources as shadow recalculation is expensive
      webGlRenderer.shadowMap.autoUpdate = false
      webGlRenderer.shadowMap.needsUpdate = true // Update once on initialization
      
      // threeScene.fog = new THREE.Fog('#f9f9f9', 300, 400)
    },
    []
  )

  const config = getViewerConfig(furnitureType)

  return (
    <div className={styles.container}>
      <Canvas
        camera={{
          position: config.cameraPosition,
          fov: 60,
          near: 0.5,
          far: 1000,
        }}
        shadows
        dpr={[1, 1.75]}
        gl={{ powerPreference: 'high-performance' }}
        className={styles.canvas}
        onCreated={handleCanvasCreated}
      >
        {/* Orbit controls for rotation and zoom */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={false}
          dampingFactor={0}
          minDistance={config.minDistance}
          maxDistance={config.maxDistance}
          minAzimuthAngle={config.minAzimuthAngle}
          maxAzimuthAngle={config.maxAzimuthAngle}
          minPolarAngle={config.minPolarAngle}
          maxPolarAngle={config.maxPolarAngle}
          target={config.target}
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
          columnWidths={columnWidths}
          columnPositions={columnPositions}
          furnitureType={furnitureType}
        />
      </Canvas>
    </div>
  )
}

export const FurnitureViewer = memo(FurnitureViewerComponent)
