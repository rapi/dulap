import React, { memo, useMemo } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { usePanel } from '~/hooks/usePanel'

interface WardrobeTopAndPlinthProps {
  verticalPanelObject: THREE.Object3D
  horizontalPanelObject: THREE.Object3D
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  selectedColor: string
}

/**
 * Wardrobe-specific TopAndPlinth component
 * 
 * Key difference from standard furniture:
 * - Top panel is narrower (90% of total width) for a more elegant wardrobe look
 * - This creates a subtle recess at the top typical of wardrobe designs
 */
const WardrobeTopAndPlinthComponent: React.FC<WardrobeTopAndPlinthProps> = ({
  verticalPanelObject: verticalPanelSource,
  horizontalPanelObject: horizontalPanelSource,
  desiredWidth: cabinetWidth,
  desiredHeight: cabinetHeight,
  desiredDepth: cabinetDepth,
  desiredPlintHeight: plinthHeight,
  selectedColor,
}) => {
  const { panelThickness: panelThicknessUnits } = FURNITURE_CONFIG

  const wardrobeTopPanelDepth = cabinetDepth - panelThicknessUnits;
  // Memoize anchor config to prevent unnecessary recreations
  const anchorConfig = useMemo(() => ({ anchorY: 'min' as const, anchorZ: 'min' as const }), [])

  // Memoize top panel config with reduced width for wardrobes
  const topPanelConfig = useMemo(() => ({
    scale: [cabinetWidth, panelThicknessUnits, wardrobeTopPanelDepth] as [number, number, number],
    position: [0, cabinetHeight - panelThicknessUnits, 0] as [number, number, number],
    color: selectedColor,
    anchor: anchorConfig,
  }), [cabinetWidth, panelThicknessUnits, wardrobeTopPanelDepth, cabinetHeight, selectedColor, anchorConfig])

  // Memoize plinth panel config (same as standard furniture)
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

export const WardrobeTopAndPlinth = memo(WardrobeTopAndPlinthComponent)

