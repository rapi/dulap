import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import { Door } from './Door'
import { applyMaterialToObject } from '../furnitureUtils'
import {
  RackColumnConfiguration,
  RackZoneType,
} from '~/types/rackConfigurationTypes'
import { RackZoneRenderer } from './rack-zones/RackZoneRenderer'
import { calculateOptimalDrawerConfig } from '~/config/rackTemplates'

interface RackColumnProps {
  horizontalPanelObject: THREE.Object3D
  roundHandleObject: THREE.Object3D
  profileHandleObject: THREE.Object3D
  hingeWingObject: THREE.Object3D
  hingeAnchorObject: THREE.Object3D
  openingType: OpeningType
  columnWidth: number
  columnHeight: number
  columnDepth: number
  plintHeight: number
  positionX: number
  selectedColor: string
  columnIndex?: number
  isSelected?: boolean
  onColumnClick?: (index: number) => void
  columnConfiguration?: RackColumnConfiguration
}

/**
 * RackColumn - Specialized column component for racks
 *
 * Features:
 * - Zone-based rendering (shelves, drawers)
 * - Doors based on template configuration and column width
 * - Symmetric shelf rendering
 */
const RackColumnComponent: React.FC<RackColumnProps> = ({
  horizontalPanelObject,
  roundHandleObject,
  profileHandleObject,
  hingeWingObject,
  hingeAnchorObject,
  openingType,
  columnWidth,
  columnHeight,
  columnDepth,
  plintHeight,
  positionX,
  selectedColor,
  columnIndex = 0,
  isSelected = false,
  onColumnClick,
  columnConfiguration,
}) => {
  const { panelSpacing, panelThickness } = FURNITURE_CONFIG
  const [isColumnHovered, setIsColumnHovered] = useState(false)

  // Combine hover and selected states - column should be "open" if either is true
  const isColumnOpen = isSelected || isColumnHovered

  // Refs for panels to apply textures
  const bottomPanelRef = useRef<THREE.Mesh>(null)

  // Determine door type based on template configuration and column width
  const doorType = useMemo(() => {
    // Check if this column has any doors configured
    const hasDoors =
      columnConfiguration?.doors && columnConfiguration.doors.length > 0

    if (!hasDoors) {
      return 'none'
    }

    // Get the first door configuration (rack columns typically have one door)
    const doorConfig = columnConfiguration?.doors?.[0]
    if (!doorConfig) {
      return 'none'
    }
    const templateDoorType = doorConfig.type

    // If template specifies 'single' door, use split doors for wide columns (>=60cm)
    if (templateDoorType === 'single') {
      return columnWidth >= 60 ? 'split' : 'single'
    }

    // If template specifies 'split', always use split
    if (templateDoorType === 'split') {
      return 'split'
    }

    return 'none'
  }, [columnConfiguration?.doors, columnWidth])

  // Calculate MASTER SHELF GRID for symmetric alignment across columns
  // IMPORTANT: Use columnHeight (actual furniture height) NOT totalZonesHeight (which varies due to rounding)
  // This ensures ALL columns use the SAME master grid regardless of their zone configuration
  const { masterShelfPositions, adjustedZones } = useMemo(() => {
    if (!columnConfiguration?.zones || columnConfiguration.zones.length === 0) {
      return { masterShelfPositions: [], adjustedZones: [] }
    }

    // Use columnHeight for master grid to ensure consistency across all columns
    const masterGridHeight = columnHeight
    const totalZonesHeight = columnConfiguration.zones.reduce(
      (sum, zone) => sum + zone.height,
      0
    )

    // SHELF SPACING CONSTRAINTS
    // - Ideal: 30cm
    // - Acceptable range: 28-32cm (hard limits for visual quality)
    // - Use stable calculation to avoid shelf count changes at arbitrary heights
    const MIN_SHELF_SPACING = 28
    const MAX_SHELF_SPACING = 32
    const OPTIMAL_SHELF_SPACING = 30

    // STABLE CALCULATION: Use optimal spacing as baseline, adjust shelf count at predictable intervals
    // This prevents the grid from jumping when height changes by 1cm
    // Calculate shelf count based on what gives us closest to optimal spacing
    let masterShelfCount =
      Math.round(masterGridHeight / OPTIMAL_SHELF_SPACING) - 1
    if (masterShelfCount < 1) masterShelfCount = 1

    // Calculate actual spacing with this shelf count
    let spacing = masterGridHeight / (masterShelfCount + 1)

    // If spacing is too small, reduce shelf count
    while (spacing < MIN_SHELF_SPACING && masterShelfCount > 1) {
      masterShelfCount--
      spacing = masterGridHeight / (masterShelfCount + 1)
    }

    // If spacing is too large, increase shelf count (if it wouldn't go below minimum)
    while (spacing > MAX_SHELF_SPACING) {
      const newSpacing = masterGridHeight / (masterShelfCount + 2)
      if (newSpacing >= MIN_SHELF_SPACING) {
        masterShelfCount++
        spacing = newSpacing
      } else {
        break // Can't add more shelves without violating minimum
      }
    }

    // Generate evenly-spaced grid positions
    const positions: number[] = []
    for (let i = 1; i <= masterShelfCount; i++) {
      positions.push(spacing * i)
    }

    // Pre-calculate adjusted zone boundaries
    const adjusted: Array<{
      originalZone: (typeof columnConfiguration.zones)[0]
      adjustedBottomY: number
      adjustedTopY: number
      adjustedHeight: number
    }> = []

    let currentTopY = totalZonesHeight
    for (const zone of columnConfiguration.zones) {
      const originalBottomY = currentTopY - zone.height
      adjusted.push({
        originalZone: zone,
        adjustedBottomY: originalBottomY,
        adjustedTopY: currentTopY,
        adjustedHeight: zone.height,
      })
      currentTopY = originalBottomY
    }

    // Adjust zone boundaries for zones with doors to snap to master grid
    // GOAL: Door zone TOP should align with a master grid position for visual symmetry
    // STRATEGY: Find the CLOSEST grid position to the target (within spacing distance)
    //           This minimizes visual jumps when height changes by small amounts

    // Get zone-specific minimum heights from adjusted zones
    const getZoneMinHeight = (zoneIndex: number): number => {
      // Use 28cm (one shelf) as default minimum for all zones
      // This is a reasonable minimum for visual quality
      return 28
    }

    const MAX_DOOR_ZONE_HEIGHT = 130 // Maximum 130cm for bottom door section
    const MIN_ADJACENT_ZONE_HEIGHT = 28

    // Helper: find the grid position CLOSEST to target (within constraints)
    const findBestGridPosition = (
      targetValue: number,
      doorBottomY: number,
      adjacentTopY: number,
      doorZoneIndex: number
    ): number | null => {
      const minDoorHeight = getZoneMinHeight(doorZoneIndex)

      // Collect all valid positions with their distance from target
      const validPositions: Array<{ pos: number; distance: number }> = []

      for (const pos of positions) {
        const doorHeight = pos - doorBottomY
        const adjacentHeight = adjacentTopY - pos

        // Check constraints: door must meet zone's minimum, adjacent zone must be >= 28cm
        if (
          doorHeight >= minDoorHeight &&
          doorHeight <= MAX_DOOR_ZONE_HEIGHT &&
          adjacentHeight >= MIN_ADJACENT_ZONE_HEIGHT
        ) {
          validPositions.push({ pos, distance: Math.abs(pos - targetValue) })
        }
      }

      if (validPositions.length === 0) return null

      // Sort by distance (closest first), then by position (larger first for tie-breaking)
      validPositions.sort((a, b) => {
        if (Math.abs(a.distance - b.distance) < 2.0) {
          // If distances are within 2cm, prefer larger position (larger/more stable door zone)
          return b.pos - a.pos
        }
        return a.distance - b.distance
      })

      // Only snap if the closest position is within reasonable distance (1.5x spacing)
      const maxSnapDistance = spacing * 1.5
      if (validPositions[0].distance <= maxSnapDistance) {
        return validPositions[0].pos
      }

      // If no position is close enough, don't snap
      return null
    }

    for (let i = 0; i < adjusted.length; i++) {
      const zone = adjusted[i].originalZone
      const hasDoorOverZone =
        columnConfiguration?.doors?.some((door) =>
          door.zoneIndices.includes(i)
        ) ?? false

      // Snap to master grid if:
      // 1. Zone has doors (for visual alignment), OR
      // 2. Zone is DRAWERS type (to match height with door sections in other columns)
      const shouldSnapToGrid =
        (hasDoorOverZone || zone.type === RackZoneType.DRAWERS) && i > 0

      if (shouldSnapToGrid) {
        const originalTop = adjusted[i].adjustedTopY
        const bottomY = adjusted[i].adjustedBottomY
        const adjacentTopY = adjusted[i - 1].adjustedTopY

        // Find the closest grid position that satisfies all constraints
        const gridCandidate = findBestGridPosition(
          originalTop,
          bottomY,
          adjacentTopY,
          i // Pass zone index to get correct min height
        )

        if (gridCandidate !== null) {
          const newHeight = gridCandidate - bottomY
          const newAdjacentHeight = adjacentTopY - gridCandidate

          adjusted[i].adjustedTopY = gridCandidate
          adjusted[i].adjustedHeight = newHeight
          adjusted[i - 1].adjustedBottomY = gridCandidate
          adjusted[i - 1].adjustedHeight = newAdjacentHeight

          // If this is a DRAWERS zone, recalculate drawer heights for the new zone height
          if (
            zone.type === RackZoneType.DRAWERS &&
            zone.drawerCount &&
            zone.drawerCount > 0
          ) {
            const minHeight = 15 // Default from template
            const maxHeight = 25
            const optimalHeight = 20

            const { count, heights } = calculateOptimalDrawerConfig(
              newHeight,
              minHeight,
              maxHeight,
              optimalHeight
            )

            // Update the zone in adjusted array with new drawer count and heights
            adjusted[i].originalZone = {
              ...zone,
              height: newHeight,
              drawerCount: count,
              drawerHeights: heights,
            }
          }
        }
      }
    }

    return { masterShelfPositions: positions, adjustedZones: adjusted }
  }, [columnConfiguration, columnHeight])

  // Memoize door dimensions and configuration based on ADJUSTED zone coverage
  const doorConfig = useMemo(() => {
    const hasDoors =
      columnConfiguration?.doors && columnConfiguration.doors.length > 0
    const hasZones = adjustedZones.length > 0

    if (!hasDoors || !hasZones) {
      const doorHeight = columnHeight - plintHeight
      const BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR = 100
      const handleHeightFromBottom =
        BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR - plintHeight
      const doorPositionY = plintHeight
      const hingeCount = 4
      const hingePositionRule = 'even' as const

      return {
        doorHeight,
        handleHeightFromBottom,
        doorPositionY,
        hingeCount,
        hingePositionRule,
      }
    }

    const doorConfigData = columnConfiguration?.doors?.[0]
    const zoneIndices = doorConfigData?.zoneIndices || []

    if (zoneIndices.length === 0) {
      const doorHeight = columnHeight - plintHeight
      const doorPositionY = plintHeight
      const BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR = 100
      const handleHeightFromBottom =
        BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR - plintHeight
      const hingeCount = 4
      const hingePositionRule = 'even' as const

      return {
        doorHeight,
        handleHeightFromBottom,
        doorPositionY,
        hingeCount,
        hingePositionRule,
      }
    }

    // Use ADJUSTED zone positions for door sizing
    const totalZonesHeight = adjustedZones.reduce(
      (sum, z) => sum + z.adjustedHeight,
      0
    )

    // Find min and max Y positions for the zones this door covers (using adjusted positions)
    let minBottomY = Infinity
    let maxTopY = -Infinity

    for (const zoneIndex of zoneIndices) {
      if (zoneIndex >= 0 && zoneIndex < adjustedZones.length) {
        const zonePos = adjustedZones[zoneIndex]
        minBottomY = Math.min(minBottomY, zonePos.adjustedBottomY)
        maxTopY = Math.max(maxTopY, zonePos.adjustedTopY)
      }
    }

    let doorHeight = maxTopY - minBottomY
    // Special case: For HALF_OPEN_HALF_CLOSED template, increase lower door height by 1cm
    const isHalfOpenHalfClosed =
      columnConfiguration?.templateId === 'HALF_OPEN_HALF_CLOSED' ||
      columnConfiguration?.templateId === 'OPEN_AND_SMALL_BOTTOM_CLOSED' ||
      columnConfiguration?.templateId === 'OPEN_AND_BOTTOM_CLOSED'
    const isLowerDoor = maxTopY > 0 // Door doesn't start from top (not full height)
    if (isHalfOpenHalfClosed && isLowerDoor) {
      doorHeight += 1 // Add 1cm to lower door height
    }

    const doorPositionY = plintHeight + minBottomY

    let handleHeightFromBottom: number | undefined
    const isFullHeightDoor = minBottomY === 0 && maxTopY === totalZonesHeight

    if (isFullHeightDoor) {
      const BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR = 100
      const idealHandleHeight = BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR - plintHeight
      if (idealHandleHeight >= minBottomY && idealHandleHeight <= maxTopY) {
        handleHeightFromBottom = idealHandleHeight - minBottomY
      } else {
        handleHeightFromBottom = doorHeight / 2
      }
    } else {
      handleHeightFromBottom = undefined
    }

    const hingeCount = doorHeight > 150 ? 4 : doorHeight > 80 ? 3 : 2
    const hingePositionRule = 'even' as const

    return {
      doorHeight,
      handleHeightFromBottom,
      doorPositionY,
      hingeCount,
      hingePositionRule,
    }
  }, [columnHeight, plintHeight, columnConfiguration, adjustedZones])

  // Pointer event handlers
  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setIsColumnHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setIsColumnHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation()
      if (onColumnClick) {
        onColumnClick(columnIndex)
      }
    },
    [onColumnClick, columnIndex]
  )

  // Apply material to panels
  useEffect(() => {
    if (bottomPanelRef.current) {
      applyMaterialToObject(bottomPanelRef.current, selectedColor)
    }
  }, [selectedColor])

  // Render hover highlight panel
  // - Shows red color only on hover
  // - Invisible when column is selected (clicked) but not hovered
  const hoverPanel = useMemo(
    () => (
      <mesh
        position={[0, columnHeight / 2, columnDepth - panelThickness + 0.1]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[columnWidth, columnHeight]} />
        <meshStandardMaterial
          color={isColumnHovered ? '#ff0000' : '#ffffff'}
          transparent={true}
          opacity={isColumnHovered ? 0.3 : 0}
          side={THREE.DoubleSide}
        />
      </mesh>
    ),
    [columnWidth, columnHeight, columnDepth, panelThickness, isColumnHovered]
  )

  // Note: No top shelf needed - the rack structure already has a top panel
  // from WardrobeTopAndPlinth component

  // Render rack interior zones
  const interiorZones = useMemo(() => {
    if (
      !columnConfiguration ||
      !columnConfiguration.zones ||
      columnConfiguration.zones.length === 0 ||
      adjustedZones.length === 0
    ) {
      return null
    }

    return adjustedZones.map(
      (
        {
          originalZone: zone,
          adjustedBottomY: zoneBottomY,
          adjustedHeight: zoneHeight,
        },
        index
      ) => {
        // Check if this zone has a door covering it (zones with doors get top shelf)
        const hasDoorOverZone =
          columnConfiguration?.doors?.some((door) =>
            door.zoneIndices.includes(index)
          ) ?? false

        // Use master grid for SHELVES zones ONLY if they don't have an explicit shelfCount
        // If a zone has an explicit shelfCount (from template constraints like minShelfCount/maxShelfCount),
        // we should respect that instead of using the master grid
        const useMasterGrid =
          (zone.type === RackZoneType.SHELVES ||
            zone.type === RackZoneType.SHELVES_FIXED) &&
          zone.shelfCount === undefined

        console.log(
          `[RackColumn] Zone ${index}: type=${zone.type}, shelfCount=${zone.shelfCount}, useMasterGrid=${useMasterGrid}`
        )

        // Check if this is the top zone (index 0) - top zones don't need a ceiling shelf
        // because the rack structure already has a top panel
        const isTopZone = index === 0

        // Check if the next zone below is a different type that needs separation
        // (e.g., SHELVES zone above DRAWERS zone needs a separating shelf)
        const nextZone = columnConfiguration.zones[index + 1]
        const needsSeparatorShelf =
          !!nextZone &&
          zone.type !== nextZone.type &&
          (zone.type === RackZoneType.SHELVES ||
            zone.type === RackZoneType.SHELVES_FIXED)

        // Determine shelf position:
        // - Separator shelf: at bottom of current zone (top of next zone)
        // - Door shelf: at top of current zone (ceiling of closed compartment)
        //   BUT: skip top shelf for top zone (index 0) as rack structure provides it
        const renderShelfAtTop = hasDoorOverZone && !isTopZone
        const shouldRenderShelf =
          (hasDoorOverZone && !isTopZone) || needsSeparatorShelf

        // Create adjusted zone with modified height for renderer
        const adjustedZone = {
          ...zone,
          height: zoneHeight, // Use adjusted height
        }

        return (
          <RackZoneRenderer
            key={`zone-${index}`}
            zone={adjustedZone}
            columnWidth={columnWidth}
            columnDepth={columnDepth}
            zoneBottomY={zoneBottomY}
            plintHeight={plintHeight}
            selectedColor={selectedColor}
            horizontalPanelObject={horizontalPanelObject}
            roundHandleObject={roundHandleObject}
            profileHandleObject={profileHandleObject}
            renderTopShelf={shouldRenderShelf}
            renderShelfAtTop={renderShelfAtTop}
            masterShelfPositions={masterShelfPositions}
            useMasterGrid={useMasterGrid}
            isColumnOpen={isColumnOpen}
          />
        )
      }
    )
  }, [
    columnConfiguration,
    columnWidth,
    columnDepth,
    plintHeight,
    selectedColor,
    horizontalPanelObject,
    roundHandleObject,
    profileHandleObject,
    adjustedZones,
    masterShelfPositions,
    isColumnOpen,
  ])

  // Object on the front of the entire column to help hover effect be triggered
  const hoverFrontPanelObject = useMemo(() => {
    return (
      <mesh
        position={[0, plintHeight + columnHeight / 2, columnDepth]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[columnWidth, columnHeight, 0.2]} />
        <meshStandardMaterial color="#000" opacity={0} transparent />
      </mesh>
    )
  }, [columnWidth, columnHeight, columnDepth, plintHeight])

  // Render doors based on doorType
  const doors = useMemo(() => {
    if (doorType === 'none') {
      return null
    }

    const {
      doorHeight,
      handleHeightFromBottom,
      doorPositionY,
      hingeCount,
      hingePositionRule,
    } = doorConfig

    if (doorType === 'split') {
      // Split doors (left and right)
      const halfWidth = columnWidth / 2
      const doorWidth = halfWidth - panelSpacing / 2

      return (
        <>
          {/* Left Door */}
          <Door
            key="door-left"
            horizontalPanelObject={horizontalPanelObject}
            roundHandleObject={roundHandleObject}
            profileHandleObject={profileHandleObject}
            hingeWingObject={hingeWingObject}
            hingeAnchorObject={hingeAnchorObject}
            openingType={openingType}
            doorWidth={doorWidth}
            doorHeight={doorHeight}
            doorDepth={columnDepth}
            selectedColor={selectedColor}
            doorIndex={0}
            positionY={doorPositionY}
            positionX={-halfWidth / 2}
            isHovered={isColumnOpen}
            openingSide="left"
            hingeCount={hingeCount}
            hingePositionRule={hingePositionRule}
            handleHeightFromBottom={handleHeightFromBottom}
          />
          {/* Right Door */}
          <Door
            key="door-right"
            horizontalPanelObject={horizontalPanelObject}
            roundHandleObject={roundHandleObject}
            profileHandleObject={profileHandleObject}
            hingeWingObject={hingeWingObject}
            hingeAnchorObject={hingeAnchorObject}
            openingType={openingType}
            doorWidth={doorWidth}
            doorHeight={doorHeight}
            doorDepth={columnDepth}
            selectedColor={selectedColor}
            doorIndex={1}
            positionY={doorPositionY}
            positionX={halfWidth / 2}
            isHovered={isColumnOpen}
            openingSide="right"
            hingeCount={hingeCount}
            hingePositionRule={hingePositionRule}
            handleHeightFromBottom={handleHeightFromBottom}
          />
        </>
      )
    }

    // Single door
    const doorWidth = columnWidth - panelSpacing

    return (
      <Door
        key="door"
        horizontalPanelObject={horizontalPanelObject}
        roundHandleObject={roundHandleObject}
        profileHandleObject={profileHandleObject}
        hingeWingObject={hingeWingObject}
        hingeAnchorObject={hingeAnchorObject}
        openingType={openingType}
        doorWidth={doorWidth}
        doorHeight={doorHeight}
        doorDepth={columnDepth}
        selectedColor={selectedColor}
        doorIndex={0}
        positionY={doorPositionY}
        positionX={0}
        isHovered={isColumnOpen}
        hingeCount={hingeCount}
        openingSide="right"
        hingePositionRule={hingePositionRule}
        handleHeightFromBottom={handleHeightFromBottom}
      />
    )
  }, [
    doorType,
    doorConfig,
    columnWidth,
    columnDepth,
    panelSpacing,
    horizontalPanelObject,
    roundHandleObject,
    profileHandleObject,
    hingeWingObject,
    hingeAnchorObject,
    openingType,
    selectedColor,
    isColumnOpen,
  ])

  return (
    <>
      <group position={[positionX, 0, 0]}>
        {hoverPanel}
        <group
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          {hoverFrontPanelObject}
        </group>
        {interiorZones}
        {doors}
      </group>
    </>
  )
}

export const RackColumn = memo(RackColumnComponent)
