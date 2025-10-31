import React, { memo, useMemo } from 'react'
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

  // Memoize anchor config to prevent unnecessary recreations
  const anchorConfig = useMemo(() => ({ anchorY: 'min' as const, anchorZ: 'min' as const }), [])

  // Memoize panel configs to ensure stable references
  const panelConfigs = useMemo(() => [
    {
      scale: [sideThickness, sideHeight, sideDepth] as [number, number, number],
      position: [-cabinetWidth / 2 + panelThickness / 2, 0, 0] as [number, number, number],
      color: selectedColor,
      anchor: anchorConfig,
    },
    {
      scale: [sideThickness, sideHeight, sideDepth] as [number, number, number],
      position: [cabinetWidth / 2 - panelThickness / 2, 0, 0] as [number, number, number],
      color: selectedColor,
      anchor: anchorConfig,
    },
  ], [sideThickness, sideHeight, sideDepth, cabinetWidth, panelThickness, selectedColor, anchorConfig])

  // Use the usePanels hook to create both panels at once
  const [leftSidePanel, rightSidePanel] = usePanels(sidePanelSource, panelConfigs)

  if (!leftSidePanel || !rightSidePanel) return null

  return (
    <group>
      <primitive key="left-side-panel" object={leftSidePanel} />
      <primitive key="right-side-panel" object={rightSidePanel} />
    </group>
  )
}

export const SidePanels = memo(SidePanelsComponent)