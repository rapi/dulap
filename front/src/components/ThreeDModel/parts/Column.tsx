import React, { memo, useState, useCallback } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { Drawer } from './Drawer'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import { Door } from './Door'

export type ColumnType = 'drawers' | 'door'

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
  columnType?: ColumnType
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
  sectionsCount,
  positionX,
  selectedColor,
  columnType = 'drawers',
  drawerOffsetZ = 15,
  lerpSpeed = 0.15,
}) => {
  const { panelThickness, panelSpacing } = FURNITURE_CONFIG
  const [isColumnHovered, setIsColumnHovered] = useState(false)

  // Calculate drawer dimensions based on column configuration
  const drawersUsableHeight = columnHeight - panelThickness - plintHeight
  const singleDrawerTotalHeight = drawersUsableHeight / sectionsCount
  const drawerHeight = singleDrawerTotalHeight - panelSpacing
  const drawerWidth = columnWidth - panelSpacing

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

  // Render side and bottom panels
  const renderPanels = () => (
    <>
      {/* Left side panel */}
      <mesh
        position={[-columnWidth / 2 + 0.1, columnHeight / 2, columnDepth/2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[columnDepth-2*panelThickness, columnHeight]} />
        <meshStandardMaterial color={selectedColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Right side panel */}
      <mesh
        position={[columnWidth / 2 - 0.1, columnHeight / 2, columnDepth/2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[columnDepth-2*panelThickness, columnHeight]} />
        <meshStandardMaterial color={selectedColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Back panel */}
      <mesh
        position={[0, columnHeight / 2, 1]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[columnWidth, columnHeight]} />
        <meshStandardMaterial color={selectedColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Bottom panel */}
      <mesh
        position={[0, plintHeight, columnDepth/2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[columnWidth, columnDepth]} />
        <meshStandardMaterial color={selectedColor} side={THREE.DoubleSide} />
      </mesh>
    </>
  )

  // Render based on column type
  if (columnType === 'door') {
    // For door type, render a single large door covering the whole column
    const doorHeight = columnHeight - plintHeight - panelThickness
    const doorPositionY = plintHeight

    return (
      <group 
        position={[positionX, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {renderPanels()}
        <Door
          key="door"
          horizontalPanelObject={horizontalPanelObject}
          roundHandleObject={roundHandleObject}
          profileHandleObject={profileHandleObject}
          hingeWingObject={hingeWingObject}
          hingeAnchorObject={hingeAnchorObject}
          openingType={openingType}
          doorWidth={drawerWidth}
          doorHeight={doorHeight}
          doorDepth={columnDepth}
          selectedColor={selectedColor}
          doorIndex={0}
          positionY={doorPositionY}
          positionX={0}
          isHovered={isColumnHovered}
        />
      </group>
    )
  }

  // Generate drawer positions for 'drawers' type
  const drawers = Array.from({ length: sectionsCount }, (_, index) => {
    const positionY =
      plintHeight + panelSpacing + singleDrawerTotalHeight * index

    return {
      index,
      positionY,
      key: `drawer-${index}`,
    }
  })

  return (
    <group 
      position={[positionX, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {renderPanels()}
      {drawers.map((drawer,index) => (
        <Drawer
          key={drawer.key}
          horizontalPanelObject={horizontalPanelObject}
          roundHandleObject={roundHandleObject}
          profileHandleObject={profileHandleObject}
          openingType={openingType}
          drawerWidth={drawerWidth}
          drawerHeight={drawerHeight}
          drawerDepth={columnDepth}
          selectedColor={selectedColor}
          drawerIndex={drawer.index}
          positionY={drawer.positionY}
          positionX={0}
          drawerOffsetZ={drawerOffsetZ-index*2}
          lerpSpeed={lerpSpeed}
          isHovered={isColumnHovered}
        />
      ))}
    </group>
  )
}

export const Column = memo(ColumnComponent)

