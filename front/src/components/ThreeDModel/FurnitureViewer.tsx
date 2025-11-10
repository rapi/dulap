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
  columnConfigurationsWithOptions,
  columnWidths,
  columnPositions,
  furnitureType,
  selectedColumnIndex: externalSelectedColumnIndex,
  onColumnClick,
  onDeselectFunctionReady,
}: Furniture3DProps) {
  const config = getViewerConfig(furnitureType)
  const { gl } = useThree()
  const [internalSelectedColumnIndex, setInternalSelectedColumnIndex] = React.useState<number | null>(null)
  
  // Use external selectedColumnIndex if provided, otherwise use internal state
  const selectedColumnIndex = externalSelectedColumnIndex !== undefined ? externalSelectedColumnIndex : internalSelectedColumnIndex
  
  // Handle column selection - combine internal state with external callback
  const handleColumnSelectionChange = useCallback((index: number | null) => {
    // If using internal state, update it
    if (externalSelectedColumnIndex === undefined) {
      setInternalSelectedColumnIndex(index)
    }
    // Always call external callback if provided (parent may update external state)
    if (onColumnClick) {
      onColumnClick(index)
    }
  }, [externalSelectedColumnIndex, onColumnClick])
  
  // Expose deselection function to parent
  const deselectColumn = useCallback(() => {
    if (externalSelectedColumnIndex === undefined) {
      setInternalSelectedColumnIndex(null)
    }
    // Note: If using external state, parent should handle deselection through their state
  }, [externalSelectedColumnIndex])
  
  // Provide the deselect function to parent when ready
  React.useEffect(() => {
    if (onDeselectFunctionReady) {
      onDeselectFunctionReady(deselectColumn)
    }
  }, [onDeselectFunctionReady, deselectColumn])
  
  // Handle deselecting column when clicking on background or shadow man
  const handleBackgroundClick = useCallback(() => {
    if (externalSelectedColumnIndex === undefined) {
      setInternalSelectedColumnIndex(null)
    }
    // Notify parent about deselection
    if (onColumnClick) {
      onColumnClick(null)
    }
  }, [externalSelectedColumnIndex, onColumnClick])
  
  // Trigger shadow update when furniture dimensions or configuration changes
  // Note: Shadow updates during animations are handled automatically by useAnimatedPosition hook
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
    openingType,
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
          onClick={handleBackgroundClick}
        />
        <GLBModel
          modelUrl="/assets/3d-models/shadow_man.glb"
          modelPosition={[config.getShadowManXPosition(width), 0, 2]}
          modelScale={[1, 1, 1]}
          overrideColorHex="#ffffff"
          shouldReceiveShadow={false}
          forceFlatColorHex="#ffffff"
          onClick={handleBackgroundClick}
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
            selectedColumnIndex={selectedColumnIndex}
            onColumnSelectionChange={handleColumnSelectionChange}
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
            columnConfigurationsWithOptions={columnConfigurationsWithOptions}
            columnWidths={columnWidths}
            columnPositions={columnPositions}
            selectedColumnIndex={selectedColumnIndex}
            onColumnSelectionChange={handleColumnSelectionChange}
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
  columnConfigurationsWithOptions,
  columnWidths,
  columnPositions,
  furnitureType,
  selectedColumnIndex,
  onColumnClick,
  onDeselectFunctionReady,
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
          columnConfigurationsWithOptions={columnConfigurationsWithOptions}
          selectedColor={selectedColor}
          currentPlintHeight={currentPlintHeight}
          sections={sections}
          openingType={openingType}
          columns={columns}
          columnConfigurations={columnConfigurations}
          columnWidths={columnWidths}
          columnPositions={columnPositions}
          furnitureType={furnitureType}
          selectedColumnIndex={selectedColumnIndex}
          onColumnClick={onColumnClick}
          onDeselectFunctionReady={onDeselectFunctionReady}
        />
      </Canvas>
    </div>
  )
}

export const FurnitureViewer = memo(FurnitureViewerComponent)
