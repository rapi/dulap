import React, { memo, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import {
  applyColorToObject,
  createPivotAnchored,
  disposeObject,
  cloneWithIndependentMaterials,
} from '../furnitureUtils'

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
  // Create object clones for the top panel and plinth panel
  const { topPanel, plinthPanel } = useMemo(() => {
    if (!verticalPanelSource || !horizontalPanelSource) {
      return {
        topPanel: null as THREE.Object3D | null,
        plinthPanel: null as THREE.Object3D | null,
      }
    }

    const topPanelModel = cloneWithIndependentMaterials(verticalPanelSource)
    const plinthPanelModel = cloneWithIndependentMaterials(
      horizontalPanelSource
    )

    // Anchor each part to bottom-front using a pivot wrapper
    const topPanelNode = createPivotAnchored(topPanelModel, {
      anchorY: 'min',
      anchorZ: 'min',
    })
    const plinthPanelNode = createPivotAnchored(plinthPanelModel, {
      anchorY: 'min',
      anchorZ: 'min',
    })

    return {
      topPanel: topPanelNode,
      plinthPanel: plinthPanelNode,
    }
  }, [verticalPanelSource, horizontalPanelSource])

  // Scale and position the panels accordingly
  useEffect(() => {
    if (!topPanel || !plinthPanel) return

    const {
      panelThickness: panelThicknessUnits,
    } = FURNITURE_CONFIG

    plinthPanel.scale.set(
      cabinetWidth,
      plinthHeight,
      panelThicknessUnits
    )
    plinthPanel.position.set(0, 0, cabinetDepth - panelThicknessUnits)

    topPanel.scale.set(
      cabinetWidth,
      panelThicknessUnits,
      cabinetDepth
    )
    topPanel.position.set(0, cabinetHeight - panelThicknessUnits, 0)

    topPanel.updateMatrixWorld(true)
    plinthPanel.updateMatrixWorld(true)
  }, [
    topPanel,
    plinthPanel,
    cabinetWidth,
    cabinetHeight,
    cabinetDepth,
    plinthHeight,
  ])

  // Apply the selected color to the panels
  useEffect(() => {
    if (!topPanel || !plinthPanel) return
    applyColorToObject(topPanel, selectedColor)
    applyColorToObject(plinthPanel, selectedColor)
  }, [topPanel, plinthPanel, selectedColor])

  useEffect(() => {
    return () => {
      if (topPanel) disposeObject(topPanel)
      if (plinthPanel) disposeObject(plinthPanel)
    }
  }, [topPanel, plinthPanel])

  if (!topPanel || !plinthPanel) return null

  return (
    <group>
      <primitive key="plinth-panel" object={plinthPanel} />
      <primitive key="top-panel" object={topPanel} />
    </group>
  )
}

export const TopAndPlinth = memo(TopAndPlinthComponent)
