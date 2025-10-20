import React, { memo } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { usePanels } from '~/hooks/usePanel'

interface SidePanelsProps {
  horizontalPanelObject: THREE.Object3D
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  selectedColor: string
}

const SidePanelsComponent: React.FC<SidePanelsProps> = ({
  horizontalPanelObject: sidePanelSource,
  desiredWidth: cabinetWidth,
  desiredHeight: cabinetHeight,
  desiredDepth: cabinetDepth,
  selectedColor,
}) => {
  const { panelThickness } = FURNITURE_CONFIG

  const sideThickness = panelThickness
  const sideHeight = cabinetHeight - panelThickness
  const sideDepth = cabinetDepth - panelThickness

  // Use the usePanels hook to create both panels at once
  const [leftSidePanel, rightSidePanel] = usePanels(sidePanelSource, [
    {
      scale: [sideThickness, sideHeight, sideDepth],
      position: [-cabinetWidth / 2 + panelThickness / 2, 0, 0],
      color: selectedColor,
      anchor: { anchorY: 'min', anchorZ: 'min' },
    },
    {
      scale: [sideThickness, sideHeight, sideDepth],
      position: [cabinetWidth / 2 - panelThickness / 2, 0, 0],
      color: selectedColor,
      anchor: { anchorY: 'min', anchorZ: 'min' },
    },
  ])

  if (!leftSidePanel || !rightSidePanel) return null

  return (
    <group>
      <primitive key="left-side-panel" object={leftSidePanel} />
      <primitive key="right-side-panel" object={rightSidePanel} />
    </group>
  )
}

export const SidePanels = memo(SidePanelsComponent)