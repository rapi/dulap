import React, { memo } from 'react'
import * as THREE from 'three'
import { Drawer } from './Drawer'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'

interface ColumnProps {
  horizontalPanelObject: THREE.Object3D
  roundHandleObject: THREE.Object3D
  profileHandleObject: THREE.Object3D
  openingType: OpeningType
  columnWidth: number
  columnHeight: number
  columnDepth: number
  plintHeight: number
  sectionsCount: number
  positionX: number
  selectedColor: string
  drawerOffsetZ?: number
  lerpSpeed?: number
}

const ColumnComponent: React.FC<ColumnProps> = ({
  horizontalPanelObject,
  roundHandleObject,
  profileHandleObject,
  openingType,
  columnWidth,
  columnHeight,
  columnDepth,
  plintHeight,
  sectionsCount,
  positionX,
  selectedColor,
  drawerOffsetZ = 15,
  lerpSpeed = 0.15,
}) => {
  const { panelThickness, drawerSpacing } = FURNITURE_CONFIG

  // Calculate drawer dimensions based on column configuration
  const drawersUsableHeight = columnHeight - panelThickness - plintHeight
  const singleDrawerTotalHeight = drawersUsableHeight / sectionsCount
  const drawerHeight = singleDrawerTotalHeight - drawerSpacing
  const drawerWidth = columnWidth - drawerSpacing

  // Generate drawer positions
  const drawers = Array.from({ length: sectionsCount }, (_, index) => {
    const positionY =
      plintHeight + drawerSpacing + singleDrawerTotalHeight * index

    return {
      index,
      positionY,
      key: `drawer-${index}`,
    }
  })

  return (
    <group position={[positionX, 0, 0]}>
      {drawers.map((drawer) => (
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
          drawerOffsetZ={drawerOffsetZ}
          lerpSpeed={lerpSpeed}
        />
      ))}
    </group>
  )
}

export const Column = memo(ColumnComponent)

