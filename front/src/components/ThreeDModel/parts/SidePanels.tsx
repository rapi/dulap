import React, { memo, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { applyColorToObject, createPivotAnchored, disposeObject, cloneWithIndependentMaterials } from '../furnitureUtils'

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
  // Create object clones for the left panel and right panel
  const { leftSidePanel, rightSidePanel } = useMemo(() => {
    if (!sidePanelSource) {
      return {
        leftSidePanel: null as THREE.Object3D | null,
        rightSidePanel: null as THREE.Object3D | null,
      }
    }

    const leftPanelModel = cloneWithIndependentMaterials(sidePanelSource)
    const rightPanelModel = cloneWithIndependentMaterials(sidePanelSource)

    const leftSidePanel = createPivotAnchored(leftPanelModel, { anchorY: 'min', anchorZ: 'min' })
    const rightSidePanel = createPivotAnchored(rightPanelModel, { anchorY: 'min', anchorZ: 'min' })

    return { leftSidePanel, rightSidePanel }
  }, [sidePanelSource])

  // Scale and position the panels accordingly
  useEffect(() => {
    if (!leftSidePanel || !rightSidePanel) return

    const { panelThickness } = FURNITURE_CONFIG

    const sideThickness = panelThickness
    const sideHeight = (cabinetHeight - panelThickness)
    const sideDepth = (cabinetDepth - panelThickness)

    leftSidePanel.scale.set(sideThickness, sideHeight, sideDepth)
    rightSidePanel.scale.set(sideThickness, sideHeight, sideDepth)

    leftSidePanel.position.set(-cabinetWidth / 2 + panelThickness / 2, 0, 0)
    rightSidePanel.position.set(+cabinetWidth / 2 - panelThickness / 2, 0, 0)

    leftSidePanel.updateMatrixWorld(true)
    rightSidePanel.updateMatrixWorld(true)
  }, [leftSidePanel, rightSidePanel, cabinetWidth, cabinetHeight, cabinetDepth])

  // Apply the selected color to the panels
  useEffect(() => {
    if (!leftSidePanel || !rightSidePanel) return
    applyColorToObject(leftSidePanel, selectedColor)
    applyColorToObject(rightSidePanel, selectedColor)
  }, [leftSidePanel, rightSidePanel, selectedColor])

  useEffect(() => {
    return () => {
      if (leftSidePanel) disposeObject(leftSidePanel)
      if (rightSidePanel) disposeObject(rightSidePanel)
    }
  }, [leftSidePanel, rightSidePanel])

  if (!leftSidePanel || !rightSidePanel) return null

  return (
    <group>
      <primitive key="left-side-panel" object={leftSidePanel} />
      <primitive key="right-side-panel" object={rightSidePanel} />
    </group>
  )
}

export const SidePanels = memo(SidePanelsComponent)
