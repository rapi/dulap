import React, { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import { Door } from './Door'
import { applyMaterialToObject } from '../furnitureUtils'

interface WardrobeColumnProps {
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
  doorType: 'single' | 'split' // Wardrobe-specific: single or split doors
  columnIndex?: number
  isSelected?: boolean
  onColumnClick?: (index: number) => void
}

/**
 * WardrobeColumn - Specialized column component for wardrobes
 * 
 * Key differences from standard Column:
 * - Full-height doors (from plinth to near top)
 * - No drawers
 * - No shelf rendering (interiors will be separate)
 * - Simpler configuration (just single vs split doors)
 */
const WardrobeColumnComponent: React.FC<WardrobeColumnProps> = ({
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
  doorType,
  columnIndex = 0,
  isSelected = false,
  onColumnClick,
}) => {
  const { panelThickness, panelSpacing } = FURNITURE_CONFIG
  const [isColumnHovered, setIsColumnHovered] = useState(false)
  
  // Combine hover and selected states - column should be "open" if either is true
  const isColumnOpen = isSelected || isColumnHovered
  
  // Refs for panels to apply textures
  const bottomPanelRef = useRef<THREE.Mesh>(null)

  // Memoize door dimensions and configuration to prevent recalculation
  const doorConfig = useMemo(() => {
    // Wardrobe-specific: Doors are taller, extending to the top
    const doorHeight = columnHeight - plintHeight
    
    // Wardrobe-specific: Handles at ~100cm from floor (ergonomic height)
    const WARDROBE_HANDLE_HEIGHT_FROM_FLOOR = 100
    const handleHeightFromBottom = WARDROBE_HANDLE_HEIGHT_FROM_FLOOR - plintHeight
    
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
  }, [columnHeight, plintHeight])

  // Pointer event handlers for column hover
  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setIsColumnHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setIsColumnHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  // Click handler for column selection
  const handleClick = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    if (onColumnClick) {
      onColumnClick(columnIndex)
    }
  }, [columnIndex, onColumnClick])

  // Memoize panel geometry to prevent recreation
  const panels = useMemo(() => (
    <>
      {/* Left side panel */}
      <mesh
        position={[-columnWidth / 2 + 0.1, columnHeight / 2, columnDepth / 2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[columnDepth - 2 * panelThickness, columnHeight]} />
        <meshStandardMaterial color={selectedColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Right side panel */}
      <mesh
        position={[columnWidth / 2 - 0.1, columnHeight / 2, columnDepth / 2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[columnDepth - 2 * panelThickness, columnHeight]} />
        <meshStandardMaterial color={selectedColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Back panel (white interior) */}
      <mesh
        position={[0, columnHeight / 2, 2 * panelThickness]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[columnWidth, columnHeight]} />
        <meshStandardMaterial color={'#ffffff'} side={THREE.DoubleSide} />
      </mesh>

      {/* Bottom panel */}
      <mesh
        ref={bottomPanelRef}
        position={[0, plintHeight, columnDepth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[columnWidth, columnDepth]} />
        <meshStandardMaterial color={'#ffffff'} side={THREE.DoubleSide} />
      </mesh>
    </>
  ), [columnWidth, columnHeight, columnDepth, plintHeight, panelThickness, selectedColor])


  const hoverPanel = useMemo(() => (
    <>
      {/* HOVER panel 
      - It becomes transparent red on hover or when selected
      */}
      <mesh
        position={[0, columnHeight / 2, columnDepth-panelThickness+0.1]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[columnWidth, columnHeight]} />
        <meshStandardMaterial 
          color={isColumnOpen ? '#ff0000' : '#ffffff'} 
          transparent={true}
          opacity={isColumnOpen ? 0.3 : 0}
          side={THREE.DoubleSide} 
        />
      </mesh>
    </>
  ), [columnWidth, columnHeight, columnDepth, panelThickness, isColumnOpen])

  
  // Apply color/texture to panels
  useEffect(() => {
    if (bottomPanelRef.current) {
      applyMaterialToObject(bottomPanelRef.current, selectedColor)
    }
  }, [selectedColor])

  // Memoize door components to prevent recreation when only hover state changes
  const doors = useMemo(() => {
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
    doorConfig,
    doorType,
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
      {panels}
      {doors}
      </group>
    </>
  )
}

export const WardrobeColumn = memo(WardrobeColumnComponent)

