import React, { memo } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { usePanel } from '~/hooks/usePanel'

interface TopAndPlinthProps {
  verticalPanelObject: THREE.Object3D
  horizontalPanelObject: THREE.Object3D
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  selectedColor: string
}

const TopAndPlinthComponent: React.FC<TopAndPlinthProps> = ({
  verticalPanelObject: verticalPanelSource,
  horizontalPanelObject: horizontalPanelSource,
  desiredWidth: cabinetWidth,
  desiredHeight: cabinetHeight,
  desiredDepth: cabinetDepth,
  desiredPlintHeight: plinthHeight,
  selectedColor,
}) => {
  const { panelThickness: panelThicknessUnits } = FURNITURE_CONFIG

  // Use the usePanel hook for top panel
  const topPanel = usePanel(verticalPanelSource, {
    scale: [cabinetWidth, panelThicknessUnits, cabinetDepth],
    position: [0, cabinetHeight - panelThicknessUnits, 0],
    color: selectedColor,
    anchor: { anchorY: 'min', anchorZ: 'min' },
  })

  // Use the usePanel hook for plinth panel
  const plinthPanel = usePanel(horizontalPanelSource, {
    scale: [cabinetWidth, plinthHeight, panelThicknessUnits],
    position: [0, 0, cabinetDepth - panelThicknessUnits],
    color: selectedColor,
    anchor: { anchorY: 'min', anchorZ: 'min' },
  })

  if (!topPanel || !plinthPanel) return null

  return (
    <group>
      <primitive key="plinth-panel" object={plinthPanel} />
      <primitive key="top-panel" object={topPanel} />
    </group>
  )
}

export const TopAndPlinth = memo(TopAndPlinthComponent)