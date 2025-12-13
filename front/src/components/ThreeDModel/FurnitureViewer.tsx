import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { GLBModel } from './GLBModel'
import { SceneLights } from './SceneLights'
import { GroundShadow } from './GroundShadow'
import * as THREE from 'three'
import { Furniture3DProps } from '~/types/furniture3D'
import { FurnitureBuilder } from './FurnitureBuilder'
import { WardrobeBuilder } from './WardrobeBuilder'
import { RackBuilder } from './RackBuilder'
import { getViewerConfig } from './furnitureViewerConfig'
import { WardrobeColumnConfiguration } from '~/types/wardrobeConfigurationTypes'
import { RackColumnConfiguration } from '~/types/rackConfigurationTypes'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { captureScreenshot } from '~/utils/screenshotUtils'
import styles from './FurnitureViewer.module.css'

// Preload models
useGLTF.preload('/assets/3d-models/bg.glb')
useGLTF.preload('/assets/3d-models/shadow_man.glb')
useGLTF.preload('/assets/3d-models/pouf-toy.glb')
useGLTF.preload('/assets/3d-models/waze-flowers.glb')

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
  rendererRef,
}: Furniture3DProps & {
  rendererRef?: React.MutableRefObject<THREE.WebGLRenderer | null>
}) {
  const config = getViewerConfig(furnitureType)
  const { gl } = useThree()
  const glRef = useRef(gl)
  glRef.current = gl

  // Expose renderer to parent via ref
  useEffect(() => {
    if (rendererRef) {
      rendererRef.current = gl
    }
  }, [gl, rendererRef])
  const [internalSelectedColumnIndex, setInternalSelectedColumnIndex] =
    React.useState<number | null>(null)

  // Use external selectedColumnIndex if provided, otherwise use internal state
  const selectedColumnIndex =
    externalSelectedColumnIndex !== undefined
      ? externalSelectedColumnIndex
      : internalSelectedColumnIndex

  // Handle column selection - combine internal state with external callback
  const handleColumnSelectionChange = useCallback(
    (index: number | null) => {
      // If using internal state, update it
      if (externalSelectedColumnIndex === undefined) {
        setInternalSelectedColumnIndex(index)
      }
      // Always call external callback if provided (parent may update external state)
      if (onColumnClick) {
        onColumnClick(index)
      }
    },
    [externalSelectedColumnIndex, onColumnClick]
  )

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
    if (
      glRef.current.shadowMap.enabled &&
      !glRef.current.shadowMap.autoUpdate
    ) {
      glRef.current.shadowMap.needsUpdate = true
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
  ])

  return (
    <>
      {/* Fog to make walls appear infinite by fading distant edges */}
      <fog
        attach="fog"
        args={[
          config.fogColor || '#f5f5f5',
          config.fogNear || 200,
          config.fogFar || 600,
        ]}
      />

      <SceneLights
        enableShadows={true}
        ambientLightIntensity={0.25}
        shadowQuality="high"
      />

      {/* Ground shadow - soft gradient shadow on the floor */}
      <GroundShadow
        width={width + 550}
        depth={depth + 550}
        opacity={0.25}
        blur={1.5}
      />

      {/* Load background & shadow man GLB models - shown in viewer, hidden in screenshots */}
      <Suspense fallback={null}>
        <GLBModel
          modelUrl="/assets/3d-models/bg.glb"
          modelPosition={[0, 0, 0]}
          modelScale={config.backgroundScale}
          shouldReceiveShadow={true}
          overrideColorHex="#ffffff"
          useLambertWhiteMaterial={true}
          onClick={handleBackgroundClick}
          userData={{ isBackground: true }}
        />
        <GLBModel
          modelUrl="/assets/3d-models/shadow_man.glb"
          modelPosition={[config.getShadowManXPosition(width), 0, 2]}
          modelScale={[1, 1, 1]}
          overrideColorHex="#ffffff"
          shouldReceiveShadow={false}
          forceFlatColorHex="#ffffff"
          onClick={handleBackgroundClick}
          userData={{ isShadowMan: true }}
        />
        {/* Pouf-toy on the left side of the wardrobe */}
        {furnitureType === 'wardrobe' && (
          <GLBModel
            modelUrl="/assets/3d-models/pouf-toy.glb"
            modelPosition={[width / 2 + 30, 0, depth / 2 + 33]}
            modelScale={[1, 1, 1]}
            shouldCastShadow={true}
            shouldReceiveShadow={true}
            // overrideColorHex="#baa397"
            onClick={handleBackgroundClick}
            userData={{ isPoufToy: true }}
          />
        )}

        {furnitureType === 'wardrobe' && (
          <GLBModel
            modelUrl="/assets/3d-models/waze-flowers.glb"
            modelPosition={[width / 2 + 150, 0, depth / 2 + 33]}
            modelScale={[1, 1, 1]}
            shouldCastShadow={true}
            shouldReceiveShadow={true}
            // overrideColorHex="#baa397"
            onClick={handleBackgroundClick}
            userData={{ isPoufToy: true }}
          />
        )}
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
            columnConfigurations={
              columnConfigurations as WardrobeColumnConfiguration[] | undefined
            }
            columnWidths={columnWidths}
            columnPositions={columnPositions}
            selectedColumnIndex={selectedColumnIndex}
            onColumnSelectionChange={handleColumnSelectionChange}
          />
        ) : furnitureType === 'rack' ? (
          <RackBuilder
            selectedColor={selectedColor}
            desiredWidth={width}
            desiredHeight={height}
            desiredDepth={depth}
            desiredPlintHeight={currentPlintHeight}
            sectionsCount={sections}
            openingType={openingType}
            columns={columns}
            columnConfigurations={
              columnConfigurations as RackColumnConfiguration[] | undefined
            }
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
            columnConfigurations={
              columnConfigurations as ColumnConfigurationType[] | undefined
            }
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

// Export interface for ref methods
export interface FurnitureViewerRef {
  captureScreenshot: (
    format?: 'image/png' | 'image/jpeg',
    quality?: number
  ) => string | null
}

// Main furniture viewer component uses Furniture3DProps
const FurnitureViewerComponent = forwardRef<
  FurnitureViewerRef,
  Furniture3DProps
>(
  (
    {
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
    },
    ref
  ) => {
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.Camera | null>(null)
    const furnitureTypeRef = useRef<string | undefined>(furnitureType)
    const widthRef = useRef<number>(width)

    // Update refs when they change
    useEffect(() => {
      furnitureTypeRef.current = furnitureType
    }, [furnitureType])

    useEffect(() => {
      widthRef.current = width
    }, [width])

    // Expose capture method via ref
    useImperativeHandle(
      ref,
      () => ({
        captureScreenshot: (
          format: 'image/png' | 'image/jpeg' = 'image/png',
          quality: number = 0.92
        ) => {
          if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
            return null
          }

          const camera = cameraRef.current as THREE.PerspectiveCamera
          if (!camera || camera.type !== 'PerspectiveCamera') {
            return null
          }

          // Get the configured camera position for this furniture type
          const config = getViewerConfig(furnitureTypeRef.current)

          // Save current camera state
          const originalPosition = camera.position.clone()
          const originalQuaternion = camera.quaternion.clone()

          // Calculate adjusted camera position based on width for stand and tv-stand
          let cameraPosition = [...config.cameraPosition] as [
            number,
            number,
            number,
          ]
          const currentWidth = widthRef.current
          const currentFurnitureType = furnitureTypeRef.current

          console.log(
            '[Screenshot] Initial camera position:',
            config.cameraPosition
          )
          console.log(
            '[Screenshot] Furniture type:',
            currentFurnitureType,
            'Width:',
            currentWidth
          )

          // For stand and tv-stand, adjust camera distance if width is >= 130cm
          // Standard distance for width < 130cm, scale up for larger widths (max 240cm)
          if (
            (currentFurnitureType === 'stand' ||
              currentFurnitureType === 'tv-stand') &&
            currentWidth >= 130
          ) {
            // Base width threshold (130cm) - standard distance below this
            const baseWidth = 130
            const maxWidth = 240
            const widthExcess = Math.min(
              currentWidth - baseWidth,
              maxWidth - baseWidth
            ) // Cap at max width

            // Calculate scale factor: scale from 1.0 (at 130cm) to ~2.0 (at 240cm)
            // Linear interpolation: 1.0 + (excess / (max - base)) * 1.0
            // This doubles the distance at max width for better framing of wide furniture
            const distanceScale =
              1.0 + (widthExcess / (maxWidth - baseWidth)) * 1.0

            console.log(
              '[Screenshot] Width excess:',
              widthExcess,
              'Distance scale:',
              distanceScale.toFixed(2)
            )

            // Scale camera position to move it further away while maintaining angle
            const target = new THREE.Vector3(...config.target)
            const baseCameraPos = new THREE.Vector3(...config.cameraPosition)
            const direction = baseCameraPos.clone().sub(target) // Vector from target to camera

            // Scale the direction vector and add back to target
            const adjustedCameraPos = target
              .clone()
              .add(direction.multiplyScalar(distanceScale))

            cameraPosition = [
              adjustedCameraPos.x,
              adjustedCameraPos.y,
              adjustedCameraPos.z,
            ]

            console.log(
              '[Screenshot] Adjusted camera position:',
              cameraPosition.map((v) => v.toFixed(2))
            )
          } else {
            console.log(
              '[Screenshot] Using standard camera position (no adjustment)'
            )
          }

          // Set camera to configured (or adjusted) position
          camera.position.set(...cameraPosition)
          console.log(
            '[Screenshot] Final camera position:',
            camera.position.toArray().map((v) => v.toFixed(2))
          )

          // Make camera look at the configured target
          camera.lookAt(...config.target)

          // Update camera matrix
          camera.updateMatrixWorld()

          // Ensure shadows are updated before capture
          if (
            rendererRef.current.shadowMap.enabled &&
            !rendererRef.current.shadowMap.autoUpdate
          ) {
            rendererRef.current.shadowMap.needsUpdate = true
          }

          // Capture screenshot (this will render the scene internally)
          const screenshot = captureScreenshot(
            rendererRef.current,
            sceneRef.current,
            camera,
            format,
            quality
          )

          // Restore original camera state
          camera.position.copy(originalPosition)
          camera.quaternion.copy(originalQuaternion)
          camera.updateMatrixWorld()

          return screenshot
        },
      }),
      []
    )

    const handleCanvasCreated = useCallback(
      ({
        gl: webGlRenderer,
        scene,
        camera,
      }: {
        gl: THREE.WebGLRenderer
        scene: THREE.Scene
        camera: THREE.Camera
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

        // Store refs for screenshot capture
        rendererRef.current = webGlRenderer
        sceneRef.current = scene
        cameraRef.current = camera

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
            // minDistance={config.minDistance}
            // maxDistance={config.maxDistance}
            // minAzimuthAngle={config.minAzimuthAngle}
            // maxAzimuthAngle={config.maxAzimuthAngle}
            // minPolarAngle={config.minPolarAngle}
            // maxPolarAngle={config.maxPolarAngle}
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
            rendererRef={rendererRef}
          />
        </Canvas>
      </div>
    )
  }
)

FurnitureViewerComponent.displayName = 'FurnitureViewerComponent'

export const FurnitureViewer = memo(
  forwardRef<FurnitureViewerRef, Furniture3DProps>((props, ref) => {
    return <FurnitureViewerComponent {...props} ref={ref} />
  })
)
