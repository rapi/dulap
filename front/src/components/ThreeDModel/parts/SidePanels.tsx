import React, { memo, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { applyColorToObject, createPivotAnchored, disposeObject, cloneWithIndependentMaterials } from '../furnitureUtils'

interface SidePanelsProps {
  horizontalScene: THREE.Object3D
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  selectedColor: string
}

const SidePanelsComponent: React.FC<SidePanelsProps> = ({
  horizontalScene: sidePanelSource,
  desiredWidth: cabinetWidth,
  desiredHeight: cabinetHeight,
  desiredDepth: cabinetDepth,
  selectedColor,
}) => {
  const { leftSidePanelPivot, rightSidePanelPivot } = useMemo(() => {
    if (!sidePanelSource) {
      return {
        leftSidePanelPivot: null as THREE.Object3D | null,
        rightSidePanelPivot: null as THREE.Object3D | null,
      }
    }

    const leftPanelModel = cloneWithIndependentMaterials(sidePanelSource)
    const rightPanelModel = cloneWithIndependentMaterials(sidePanelSource)

    const leftSidePanelPivot = createPivotAnchored(leftPanelModel, { anchorY: 'min', anchorZ: 'min' })
    const rightSidePanelPivot = createPivotAnchored(rightPanelModel, { anchorY: 'min', anchorZ: 'min' })

    return { leftSidePanelPivot, rightSidePanelPivot }
  }, [sidePanelSource])

  useEffect(() => {
    if (!leftSidePanelPivot || !rightSidePanelPivot) return

    const { panelThickness, defaultScale } = FURNITURE_CONFIG

    const sideThickness = panelThickness * defaultScale
    const sideHeight = (cabinetHeight - panelThickness) * defaultScale
    const sideDepth = (cabinetDepth - panelThickness) * defaultScale

    leftSidePanelPivot.scale.set(sideThickness, sideHeight, sideDepth)
    rightSidePanelPivot.scale.set(sideThickness, sideHeight, sideDepth)

    leftSidePanelPivot.position.set(-cabinetWidth / 2 + panelThickness / 2, 0, 0)
    rightSidePanelPivot.position.set(+cabinetWidth / 2 - panelThickness / 2, 0, 0)

    leftSidePanelPivot.updateMatrixWorld(true)
    rightSidePanelPivot.updateMatrixWorld(true)
  }, [leftSidePanelPivot, rightSidePanelPivot, cabinetWidth, cabinetHeight, cabinetDepth])

  useEffect(() => {
    if (!leftSidePanelPivot || !rightSidePanelPivot) return
    applyColorToObject(leftSidePanelPivot, selectedColor)
    applyColorToObject(rightSidePanelPivot, selectedColor)
  }, [leftSidePanelPivot, rightSidePanelPivot, selectedColor])

  useEffect(() => {
    return () => {
      if (leftSidePanelPivot) disposeObject(leftSidePanelPivot)
      if (rightSidePanelPivot) disposeObject(rightSidePanelPivot)
    }
  }, [leftSidePanelPivot, rightSidePanelPivot])

  if (!leftSidePanelPivot || !rightSidePanelPivot) return null

  return (
    <group>
      <primitive object={leftSidePanelPivot} />
      <primitive object={rightSidePanelPivot} />
    </group>
  )
}

export const SidePanels = memo(SidePanelsComponent)
