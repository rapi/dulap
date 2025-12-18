import React, { memo, useMemo, Suspense } from 'react'
import { Html } from '@react-three/drei'
import { GLBModel } from '../GLBModel'
import {
  RackColumnConfiguration,
  RackZoneType,
} from '~/types/rackConfigurationTypes'

interface RackDecorationsProps {
  columnConfigurations?: RackColumnConfiguration[]
  columnWidths?: number[]
  columnPositions?: number[]
  columns: number
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
}

/**
 * Book decoration types - each type is used only once (no repeats)
 * To add new decorations in the future, simply add them to DECORATION_TYPES below.
 */
interface DecorationType {
  modelUrl: string
  scale: [number, number, number]
  userData: Record<string, boolean>
  width: number // Model width in cm (needed for proper positioning since pivot is at left-bottom)
  position?: 'left' | 'center' | 'right' // Base position on shelf
  offsetX?: number // Fine-tune position in cm from base position
  offsetZ?: number // Fine-tune position in cm from base position
}

/**
 * Loader component shown while decorations are loading
 */
const DecorationLoader: React.FC = () => (
  <Html center>
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '16px 24px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <span style={{ color: '#333' }}>Loading decorations...</span>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </Html>
)

/**
 * Available decoration types
 * Each decoration will be used at most once across the entire rack
 * Add new decoration types here as needed
 */
const DECORATION_TYPES: Record<string, DecorationType> = {
  cactus: {
    modelUrl: '/assets/3d-models/cactus.glb',
    scale: [1, 1, 1],
    width: 10, // Model width in cm
    position: 'center',
    offsetZ: 10,
    userData: { isCactus: true },
  },
  booksHorizontal: {
    modelUrl: '/assets/3d-models/books-vertical-1.glb',
    scale: [1, 1, 1],
    width: 20, // Model width in cm
    offsetX: 5,
    position: 'left',
    userData: { isBooksHorizontal: true },
  },
  booksHorizontal2: {
    modelUrl: '/assets/3d-models/books-vertical-2.glb',
    scale: [1, 1, 1],
    width: 24, // Model width in cm
    position: 'right',
    userData: { isBooksHorizontal2: true },
  },
  cactus2: {
    modelUrl: '/assets/3d-models/cactus-2.glb',
    scale: [1, 1, 1],
    width: 30, // Model width in cm
    position: 'center',
    offsetZ: 10,
    userData: { isCactus: true },
  },

  booksWhite: {
    modelUrl: '/assets/3d-models/books-vertical-4.glb',
    scale: [1, 1, 1],
    width: 30, // Model width in cm
    position: 'right',
    userData: { isBooksWhite: true },
  },
  books: {
    modelUrl: '/assets/3d-models/books-horizontal-1.glb',
    scale: [1, 1, 1],
    width: 20, // Model width in cm
    position: 'left',
    userData: { isBooks: true },
  },
  // books3: {
  //   modelUrl: '/assets/3d-models/books-vertical-3.glb',
  //   scale: [1, 1, 1],
  //   width: 22, // Model width in cm
  //   position: 'left',
  //   userData: { isBooks3: true },
  // },
}

/**
 * Seeded random number generator (0-1)
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Determine if a shelf should have books (not all shelves should be decorated)
 * Returns true ~60% of the time for visual variety
 */
const shouldDecorateShelf = (seed: number): boolean => {
  return seededRandom(seed + 999) > 0.7 // 60% chance of having books
}

/**
 * RackDecorations - Renders decorations on rack shelves
 *
 * This component:
 * - Calculates the master shelf grid (same logic as RackColumn)
 * - Places decorations at fixed positions on each shelf
 * - Works across all columns, including those with doors
 * - Only decorates SHELVES zones
 */
const RackDecorationsComponent: React.FC<RackDecorationsProps> = ({
  columnConfigurations,
  columnWidths,
  columnPositions,
  columns,
  desiredWidth,
  desiredHeight,
  desiredPlintHeight,
}) => {
  // Calculate column data (same as RackBuilder)
  const columnData = useMemo(() => {
    const useVariableWidths =
      columnWidths !== undefined && columnWidths.length > 0
    const useCustomPositions =
      columnPositions !== undefined && columnPositions.length > 0
    const defaultColumnWidth = desiredWidth / columns

    return Array.from({ length: columns }, (_, index) => {
      const columnWidth = useVariableWidths
        ? columnWidths[index]
        : defaultColumnWidth
      const columnPositionX = useCustomPositions
        ? columnPositions[index]
        : -desiredWidth / 2 + columnWidth / 2 + index * columnWidth

      return { width: columnWidth, positionX: columnPositionX }
    })
  }, [columns, columnWidths, columnPositions, desiredWidth])

  // Calculate master shelf grid and decorations for all columns
  const decorations = useMemo(() => {
    const allDecorations: Array<{
      key: string
      modelUrl: string
      position: [number, number, number]
      scale: [number, number, number]
      rotation?: [number, number, number]
      userData?: Record<string, boolean | string>
    }> = []

    // STEP 1: Collect all potential shelf positions from ALL columns
    interface ShelfCandidate {
      colIndex: number
      columnPositionX: number
      columnWidth: number
      shelfPos: number
      absoluteShelfY: number
      seed: number
    }
    const allShelfCandidates: ShelfCandidate[] = []

    // Process each column to collect shelf positions
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      const columnConfig = columnConfigurations?.[colIndex]
      const { positionX: columnPositionX, width: columnWidth } =
        columnData[colIndex]

      if (!columnConfig?.zones || columnConfig.zones.length === 0) {
        continue
      }

      // Calculate MASTER SHELF GRID (same logic as RackColumn)
      const masterGridHeight = desiredHeight
      const MIN_SHELF_SPACING = 28
      const MAX_SHELF_SPACING = 32
      const OPTIMAL_SHELF_SPACING = 30

      let masterShelfCount =
        Math.round(masterGridHeight / OPTIMAL_SHELF_SPACING) - 1
      if (masterShelfCount < 1) masterShelfCount = 1

      let spacing = masterGridHeight / (masterShelfCount + 1)

      while (spacing < MIN_SHELF_SPACING && masterShelfCount > 1) {
        masterShelfCount--
        spacing = masterGridHeight / (masterShelfCount + 1)
      }

      while (spacing > MAX_SHELF_SPACING) {
        const newSpacing = masterGridHeight / (masterShelfCount + 2)
        if (newSpacing >= MIN_SHELF_SPACING) {
          masterShelfCount++
          spacing = newSpacing
        } else {
          break
        }
      }

      const masterShelfPositions: number[] = []
      for (let i = 1; i <= masterShelfCount; i++) {
        masterShelfPositions.push(spacing * i)
      }
      // Calculate adjusted zones (same as RackColumn)
      const totalZonesHeight = columnConfig.zones.reduce(
        (sum, zone) => sum + zone.height,
        0
      )
      const adjustedZones: Array<{
        originalZone: (typeof columnConfig.zones)[0]
        adjustedBottomY: number
        adjustedTopY: number
      }> = []

      let currentTopY = totalZonesHeight
      for (const zone of columnConfig.zones) {
        const originalBottomY = currentTopY - zone.height
        adjustedZones.push({
          originalZone: zone,
          adjustedBottomY: originalBottomY,
          adjustedTopY: currentTopY,
        })
        currentTopY = originalBottomY
      }

      // Find SHELVES zones and their shelf positions
      for (let zoneIndex = 0; zoneIndex < adjustedZones.length; zoneIndex++) {
        const zone = adjustedZones[zoneIndex]
        const zoneType = zone.originalZone.type

        // Only decorate SHELVES zones
        if (
          zoneType !== RackZoneType.SHELVES &&
          zoneType !== RackZoneType.SHELVES_FIXED
        ) {
          continue
        }

        // Find shelves in this zone from master grid
        const zoneTop = zone.adjustedTopY
        const zoneBottom = zone.adjustedBottomY
        const SHELF_MARGIN = 5

        const shelvesInZone = masterShelfPositions.filter(
          (pos) =>
            pos > zoneBottom + SHELF_MARGIN && pos < zoneTop - SHELF_MARGIN
        )

        // Collect shelf candidates from this zone
        shelvesInZone.forEach((shelfPos, shelfIndex) => {
          // Position books ON TOP of shelf surface
          const SHELF_THICKNESS = 2 // Shelf thickness in cm
          const absoluteShelfY =
            desiredPlintHeight + shelfPos + SHELF_THICKNESS - 1

          // Use column and shelf indices as seed for consistent randomization
          const seed = colIndex * 1000 + shelfIndex

          // Add to candidates
          allShelfCandidates.push({
            colIndex,
            columnPositionX,
            columnWidth,
            shelfPos,
            absoluteShelfY,
            seed,
          })
        })
      }
    }

    // STEP 2: Filter candidates based on random selection (60% chance)
    const selectedShelves = allShelfCandidates.filter((candidate) =>
      shouldDecorateShelf(candidate.seed)
    )

    // STEP 3: Distribute unique decorations across selected shelves (spreading across columns)
    const decorationKeys = Object.keys(DECORATION_TYPES)
    const decorationZ = 3

    // Sort shelves to mix columns (alternating between columns instead of all col0, then col1, then col2)
    // This ensures decorations spread across all columns
    const sortedShelves = [...selectedShelves].sort((a, b) => {
      // Primary sort by shelf position (Y), then by column
      // This mixes columns while maintaining some vertical distribution
      if (Math.abs(a.absoluteShelfY - b.absoluteShelfY) < 20) {
        // If shelves are at similar heights, sort by column
        return a.colIndex - b.colIndex
      }
      return a.absoluteShelfY - b.absoluteShelfY
    })

    // Spread decorations across different shelves (not on same horizontal level)
    // Each decoration should be on a completely different shelf
    const step = Math.max(
      1,
      Math.floor(sortedShelves.length / decorationKeys.length)
    )

    decorationKeys.forEach((decorKey, decorIndex) => {
      const shelfIndex = decorIndex * step
      if (shelfIndex >= sortedShelves.length) return

      const shelf = sortedShelves[shelfIndex]
      const decoration = DECORATION_TYPES[decorKey]

      // Calculate base position based on 'position' property
      // Note: Model pivot is at left-bottom, so we need to adjust for model width
      const shelfLeftEdge = shelf.columnPositionX - shelf.columnWidth / 2
      const shelfRightEdge = shelf.columnPositionX + shelf.columnWidth / 2
      const shelfCenter = shelf.columnPositionX

      let basePositionX: number
      switch (decoration.position) {
        case 'left':
          // Pivot at left, no adjustment needed
          basePositionX = shelfLeftEdge
          break
        case 'right':
          // Position so the RIGHT edge of the model aligns with shelf right edge
          // Since pivot is at left, subtract the model width
          basePositionX = shelfRightEdge - decoration.width
          break
        case 'center':
          // Position so the CENTER of the model is at shelf center
          // Since pivot is at left, subtract half the model width
          basePositionX = shelfCenter - decoration.width / 2
          break
        default:
          // Default to left if not specified
          basePositionX = shelfLeftEdge
      }

      // Apply offsetX for fine-tuning
      const booksX = basePositionX + (decoration.offsetX || 0)

      allDecorations.push({
        key: `decor-col${shelf.colIndex}-${decorKey}`,
        modelUrl: decoration.modelUrl,
        position: [
          booksX,
          shelf.absoluteShelfY,
          decoration.offsetZ || decorationZ,
        ],
        scale: decoration.scale,
        rotation: undefined,
        userData: decoration.userData,
      })
    })

    return allDecorations
  }, [
    columns,
    columnConfigurations,
    columnData,
    desiredHeight,
    desiredPlintHeight,
  ])

  // Render unique books (no repeats) on ~60% of shelves
  return (
    <group>
      <Suspense fallback={<DecorationLoader />}>
        {/* Unique book decorations - each type used only once */}
        {decorations.map((decor) => (
          <GLBModel
            key={decor.key}
            modelUrl={decor.modelUrl}
            modelPosition={decor.position}
            modelScale={decor.scale}
            modelRotation={decor.rotation}
            shouldCastShadow={true}
            shouldReceiveShadow={true}
            userData={decor.userData}
          />
        ))}
      </Suspense>
    </group>
  )
}

export const RackDecorations = memo(RackDecorationsComponent)
