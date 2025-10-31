import React, { memo, useMemo } from 'react'
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

  // Memoize anchor config to prevent unnecessary recreations
  const anchorConfig = useMemo(() => ({ anchorY: 'min' as const, anchorZ: 'min' as const }), [])

  // Memoize top panel config
  const topPanelConfig = useMemo(() => ({
    scale: [cabinetWidth, panelThicknessUnits, cabinetDepth] as [number, number, number],
    position: [0, cabinetHeight - panelThicknessUnits, 0] as [number, number, number],
    color: selectedColor,
    anchor: anchorConfig,
  }), [cabinetWidth, panelThicknessUnits, cabinetDepth, cabinetHeight, selectedColor, anchorConfig])

  // Memoize plinth panel config
  const plinthPanelConfig = useMemo(() => ({
    scale: [cabinetWidth, plinthHeight, panelThicknessUnits] as [number, number, number],
    position: [0, 0, cabinetDepth - panelThicknessUnits] as [number, number, number],
    color: selectedColor,
    anchor: anchorConfig,
  }), [cabinetWidth, plinthHeight, panelThicknessUnits, cabinetDepth, selectedColor, anchorConfig])

  // Use the usePanel hook for top panel
  const topPanel = usePanel(verticalPanelSource, topPanelConfig)

  // Use the usePanel hook for plinth panel
  const plinthPanel = usePanel(horizontalPanelSource, plinthPanelConfig)

  if (!topPanel || !plinthPanel) return null

  return (
    <group>
      <primitive key="plinth-panel" object={plinthPanel} />
      <primitive key="top-panel" object={topPanel} />
    </group>
  )
}

export const TopAndPlinth = memo(TopAndPlinthComponent)