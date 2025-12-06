import React, { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import { Door } from './Door'
import { applyMaterialToObject } from '../furnitureUtils'
import { BookcaseColumnConfiguration, BookcaseZoneType } from '~/types/bookcaseConfigurationTypes'
import { BookcaseZoneRenderer } from './bookcase-zones/BookcaseZoneRenderer'

interface BookcaseColumnProps {
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
  columnConfiguration?: BookcaseColumnConfiguration
}

/**
 * BookcaseColumn - Specialized column component for bookcases
 * 
 * Features:
 * - Zone-based rendering (shelves, drawers)
 * - Doors based on template configuration and column width
 * - Symmetric shelf rendering
 */
const BookcaseColumnComponent: React.FC<BookcaseColumnProps> = ({
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
    const hasDoors = columnConfiguration?.doors && columnConfiguration.doors.length > 0
    
    if (!hasDoors) {
      return 'none'
    }
    
    // Get the first door configuration (bookcase columns typically have one door)
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

  // Memoize door dimensions and configuration based on zone coverage
  const doorConfig = useMemo(() => {
    // Check if we have door configuration and zones
    const hasDoors = columnConfiguration?.doors && columnConfiguration.doors.length > 0
    const hasZones = columnConfiguration?.zones && columnConfiguration.zones.length > 0
    
    if (!hasDoors || !hasZones) {
      // Default to full height if no specific zone configuration
      const doorHeight = columnHeight - plintHeight
      // Full-height door: handle at 100cm from floor (like wardrobes)
      const BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR = 100
      const handleHeightFromBottom = BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR - plintHeight
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
    
    // Get the first door configuration
    const doorConfigData = columnConfiguration?.doors?.[0]
    const zoneIndices = doorConfigData?.zoneIndices || []
    
    if (zoneIndices.length === 0) {
      // No zones specified, use full height
      const doorHeight = columnHeight - plintHeight
      const doorPositionY = plintHeight
      // Full-height door: handle at 100cm from floor (like wardrobes)
      const BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR = 100
      const handleHeightFromBottom = BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR - plintHeight
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
    
    // Calculate total zones height and positions
    const zones = columnConfiguration.zones
    const totalZonesHeight = zones.reduce((sum, zone) => sum + zone.height, 0)
    
    // Build zone positions array (from top to bottom)
    const zonePositions: Array<{ bottomY: number; topY: number; height: number }> = []
    let currentTopY = totalZonesHeight
    
    for (const zone of zones) {
      const bottomY = currentTopY - zone.height
      zonePositions.push({
        bottomY,
        topY: currentTopY,
        height: zone.height,
      })
      currentTopY = bottomY
    }
    
    // Find min and max Y positions for the zones this door covers
    let minBottomY = Infinity
    let maxTopY = -Infinity
    
    for (const zoneIndex of zoneIndices) {
      if (zoneIndex >= 0 && zoneIndex < zonePositions.length) {
        const zonePos = zonePositions[zoneIndex]
        minBottomY = Math.min(minBottomY, zonePos.bottomY)
        maxTopY = Math.max(maxTopY, zonePos.topY)
      }
    }
    
    // Calculate door dimensions
    const doorHeight = maxTopY - minBottomY
    const doorPositionY = plintHeight + minBottomY
    
    // Handle position:
    // - Full-height doors (cover entire bookcase): handle at 100cm from floor
    // - Partial doors (cover some zones): handle at top of door
    let handleHeightFromBottom: number | undefined
    
    // Check if this is a full-height door (covers from bottom to top of all zones)
    const isFullHeightDoor = minBottomY === 0 && maxTopY === totalZonesHeight
    
    if (isFullHeightDoor) {
      // Full-height door: handle at 100cm from floor (like wardrobes)
      const BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR = 100
      const idealHandleHeight = BOOKCASE_HANDLE_HEIGHT_FROM_FLOOR - plintHeight
      if (idealHandleHeight >= minBottomY && idealHandleHeight <= maxTopY) {
        handleHeightFromBottom = idealHandleHeight - minBottomY
      } else {
        handleHeightFromBottom = doorHeight / 2
      }
    } else {
      // Partial door: handle at top (like stands)
      handleHeightFromBottom = undefined
    }
    
    // Hinge count based on door height
    const hingeCount = doorHeight > 150 ? 4 : doorHeight > 80 ? 3 : 2
    const hingePositionRule = 'even' as const
    
    return {
      doorHeight,
      handleHeightFromBottom,
      doorPositionY,
      hingeCount,
      hingePositionRule,
    }
  }, [columnHeight, plintHeight, columnConfiguration])

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

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (onColumnClick) {
      onColumnClick(columnIndex)
    }
  }, [onColumnClick, columnIndex])

  // Apply material to panels
  useEffect(() => {
    if (bottomPanelRef.current) {
      applyMaterialToObject(bottomPanelRef.current, selectedColor)
    }
  }, [selectedColor])

  // Render hover highlight panel
  // - Shows red color only on hover
  // - Invisible when column is selected (clicked) but not hovered
  const hoverPanel = useMemo(() => (
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
  ), [columnWidth, columnHeight, columnDepth, panelThickness, isColumnHovered])

  // Note: No top shelf needed - the bookcase structure already has a top panel
  // from WardrobeTopAndPlinth component

  // Render bookcase interior zones
  const interiorZones = useMemo(() => {
    if (!columnConfiguration || !columnConfiguration.zones || columnConfiguration.zones.length === 0) {
      return null
    }

    // Calculate total height of all zones
    const totalZonesHeight = columnConfiguration.zones.reduce((sum, zone) => sum + zone.height, 0)

    // Stack zones from TOP to BOTTOM (zones array is in top-to-bottom order)
    // Start from the top of the bookcase and work down
    let currentTopY = totalZonesHeight // Start at the top

    return columnConfiguration.zones.map((zone, index) => {
      // Calculate zone bottom: current top minus zone height
      currentTopY -= zone.height
      const zoneBottomY = currentTopY
      
      // Check if this zone has a door covering it (zones with doors get top shelf)
      const hasDoorOverZone = columnConfiguration?.doors?.some(door => 
        door.zoneIndices.includes(index)
      ) ?? false
      
      // Check if this is the top zone (index 0) - top zones don't need a ceiling shelf
      // because the bookcase structure already has a top panel
      const isTopZone = index === 0
      
      // Check if the next zone below is a different type that needs separation
      // (e.g., SHELVES zone above DRAWERS zone needs a separating shelf)
      const nextZone = columnConfiguration.zones[index + 1]
      const needsSeparatorShelf = !!nextZone && 
        zone.type !== nextZone.type &&
        (zone.type === BookcaseZoneType.SHELVES || zone.type === BookcaseZoneType.SHELVES_FIXED)
      
      // Determine shelf position:
      // - Separator shelf: at bottom of current zone (top of next zone)
      // - Door shelf: at top of current zone (ceiling of closed compartment)
      //   BUT: skip top shelf for top zone (index 0) as bookcase structure provides it
      const renderShelfAtTop = hasDoorOverZone && !isTopZone
      const shouldRenderShelf = (hasDoorOverZone && !isTopZone) || needsSeparatorShelf

      return (
        <BookcaseZoneRenderer
          key={`zone-${index}`}
          zone={zone}
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
        />
      )
    })
  }, [
    columnConfiguration, 
    columnWidth, 
    columnDepth, 
    plintHeight, 
    selectedColor,
    horizontalPanelObject,
    roundHandleObject,
    profileHandleObject
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

    const { doorHeight, handleHeightFromBottom, doorPositionY, hingeCount, hingePositionRule } = doorConfig

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
      <group 
        position={[positionX, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {hoverPanel}
        {hoverFrontPanelObject}
        {interiorZones}
        {doors}
      </group>
    </>
  )
}

export const BookcaseColumn = memo(BookcaseColumnComponent)

