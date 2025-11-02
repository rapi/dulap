import React, { memo, useState, useCallback, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { Drawer } from './Drawer'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import { Door } from './Door'
import { 
  ColumnConfigurationType, 
  getConfigurationMetadata
} from '~/types/columnConfigurationTypes'
import {
  applyColorToObject,
  createPanelPivotWithFlag,
  disposeObject,
} from '../furnitureUtils'

interface ColumnProps {
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
  sectionsCount: number
  positionX: number
  selectedColor: string
  columnType?: ColumnConfigurationType
  drawerOffsetZ?: number
  lerpSpeed?: number
}

const ColumnComponent: React.FC<ColumnProps> = ({
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
  sectionsCount, // Legacy fallback only
  positionX,
  selectedColor,
  columnType = ColumnConfigurationType.DRAWERS_3,
  drawerOffsetZ = 15,
  lerpSpeed = 0.15,
}) => {
  const { panelThickness, panelSpacing } = FURNITURE_CONFIG
  const [isColumnHovered, setIsColumnHovered] = useState(false)

  // Memoize configuration metadata and calculations to prevent recalculation
  const columnConfig = useMemo(() => {
    // Get configuration metadata
    const metadata = getConfigurationMetadata(columnType)
    
    // Determine sections count from configuration type
    const actualSections = metadata.drawerCount > 0 ? metadata.drawerCount : (metadata.shelfCount + 1)
    const usableSectionsCount = actualSections > 0 ? actualSections : sectionsCount

    // Calculate drawer/shelf dimensions based on column configuration
    const usableHeight = columnHeight - panelThickness - plintHeight
    const singleSectionTotalHeight = usableHeight / usableSectionsCount
    const sectionHeight = singleSectionTotalHeight - panelSpacing
    const sectionWidth = columnWidth - panelSpacing

    return {
      metadata,
      usableSectionsCount,
      usableHeight,
      singleSectionTotalHeight,
      sectionHeight,
      sectionWidth,
    }
  }, [columnType, sectionsCount, columnHeight, panelThickness, plintHeight, columnWidth, panelSpacing])

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

      {/* Back panel */}
      <mesh
        position={[0, columnHeight / 2, 2 * panelThickness]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[columnWidth, columnHeight]} />
        <meshStandardMaterial color={'#ffffff'} side={THREE.DoubleSide} />
      </mesh>

      {/* Bottom panel */}
      <mesh
        position={[0, plintHeight, columnDepth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[columnWidth, columnDepth]} />
        <meshStandardMaterial color={selectedColor} side={THREE.DoubleSide} />
      </mesh>
    </>
  ), [columnWidth, columnHeight, columnDepth, plintHeight, panelThickness, selectedColor])

  // Create shelf objects (horizontal panels) using the same pattern as doors/top/plinth
  const shelfPivots = useMemo(() => {
    const shelfCount = columnConfig.metadata.shelfCount
    if (shelfCount === 0 || !horizontalPanelObject) return []
    
    return Array.from({ length: shelfCount }, (_, index) => {
      const shelfPivot = createPanelPivotWithFlag(
        horizontalPanelObject,
        'isShelf'
      )
      shelfPivot.userData.shelfIndex = index
      return shelfPivot
    })
  }, [horizontalPanelObject, columnConfig.metadata.shelfCount])

  // Scale and position shelves
  useEffect(() => {
    if (shelfPivots.length === 0) return

    const doorWidth = columnConfig.metadata.doorCount === 2 
      ? columnWidth 
      : columnWidth - panelSpacing

    shelfPivots.forEach((shelfPivot) => {
      const index = shelfPivot.userData.shelfIndex
      const shelfPositionY = plintHeight + columnConfig.singleSectionTotalHeight * (index + 1)
      
      // Scale the shelf to fit the width and depth
      shelfPivot.scale.set(
        doorWidth - panelSpacing,
        panelThickness,
        columnDepth - 2 * panelThickness
      )
      
      // Position the shelf
      shelfPivot.position.set(0, shelfPositionY, 0)
    })
  }, [
    shelfPivots,
    columnWidth,
    columnDepth,
    plintHeight,
    columnConfig.singleSectionTotalHeight,
    columnConfig.metadata.doorCount,
    panelSpacing,
    panelThickness,
  ])

  // Apply color to shelves
  useEffect(() => {
    if (shelfPivots.length === 0) return
    
    shelfPivots.forEach((shelfPivot) => {
      applyColorToObject(shelfPivot, selectedColor)
    })
  }, [shelfPivots, selectedColor])

  // Cleanup shelves
  useEffect(() => {
    return () => {
      shelfPivots.forEach((shelfPivot) => disposeObject(shelfPivot))
    }
  }, [shelfPivots])

  // Render shelves as primitives
  const renderShelves = () => {
    if (shelfPivots.length === 0) return null
    
    return (
      <>
        {shelfPivots.map((shelfPivot) => (
          <primitive 
            key={`shelf-${shelfPivot.userData.shelfIndex}`} 
            object={shelfPivot} 
          />
        ))}
      </>
    )
  }

  // Memoize content rendering to prevent recreation
  const content = useMemo(() => {
    const { metadata, usableSectionsCount, singleSectionTotalHeight, sectionHeight, sectionWidth } = columnConfig
    
    // DRAWERS CONFIGURATIONS (1-5 drawers)
    if (metadata.hasDrawers) {
      const drawers = Array.from({ length: usableSectionsCount }, (_, index) => {
        const positionY = plintHeight + panelSpacing + singleSectionTotalHeight * index
        return {
          index,
          positionY,
          key: `drawer-${index}`,
        }
      })

      return (
        <>
          {drawers.map((drawer, index) => (
            <Drawer
              key={drawer.key}
              horizontalPanelObject={horizontalPanelObject}
              roundHandleObject={roundHandleObject}
              profileHandleObject={profileHandleObject}
              openingType={openingType}
              drawerWidth={sectionWidth}
              drawerHeight={sectionHeight}
              drawerDepth={columnDepth}
              selectedColor={selectedColor}
              drawerIndex={drawer.index}
              positionY={drawer.positionY}
              positionX={0}
              drawerOffsetZ={drawerOffsetZ - index * 2}
              lerpSpeed={lerpSpeed}
              isHovered={isColumnHovered}
            />
          ))}
        </>
      )
    }

    // DOOR CONFIGURATIONS (single door or split doors with shelves)
    if (metadata.hasDoors) {
      const doorHeight = columnHeight - plintHeight - panelThickness
      const doorPositionY = plintHeight
      const hingeCount = metadata.hingeCount
      const hingePositionRule = metadata.hingePositionRule

      // SPLIT DOORS (left and right doors)
      if (metadata.doorCount === 2) {
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
              isHovered={isColumnHovered}
              openingSide='left'
              hingeCount={hingeCount}
              hingePositionRule={hingePositionRule}
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
              isHovered={isColumnHovered}
              openingSide='right'
              hingeCount={hingeCount}
              hingePositionRule={hingePositionRule}
            />
            {/* Shelves for split doors */}
            {renderShelves()}
          </>
        )
      }

      // SINGLE DOOR
      return (
        <>
          <Door
            key="door"
            horizontalPanelObject={horizontalPanelObject}
            roundHandleObject={roundHandleObject}
            profileHandleObject={profileHandleObject}
            hingeWingObject={hingeWingObject}
            hingeAnchorObject={hingeAnchorObject}
            openingType={openingType}
            doorWidth={sectionWidth}
            doorHeight={doorHeight}
            doorDepth={columnDepth}
            selectedColor={selectedColor}
            doorIndex={0}
            positionY={doorPositionY}
            positionX={0}
            isHovered={isColumnHovered}
            hingeCount={hingeCount}
            hingePositionRule={hingePositionRule}
          />
          {/* Shelves inside single door */}
          {renderShelves()}
        </>
      )
    }

    return null
  }, [
    columnConfig,
    plintHeight,
    panelSpacing,
    horizontalPanelObject,
    roundHandleObject,
    profileHandleObject,
    hingeWingObject,
    hingeAnchorObject,
    openingType,
    columnDepth,
    selectedColor,
    isColumnHovered,
    drawerOffsetZ,
    lerpSpeed,
    columnWidth,
    columnHeight,
  ])

  return (
    <group 
      position={[positionX, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {panels}
      {content}
    </group>
  )
}

export const Column = memo(ColumnComponent)

