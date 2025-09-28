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
  verticalScene: THREE.Object3D
  horizontalScene: THREE.Object3D
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  selectedColor: string
}

const TopAndPlinthComponent: React.FC<TopAndPlinthProps> = ({
  verticalScene: verticalPanelSource,
  horizontalScene: horizontalPanelSource,
  desiredWidth: cabinetWidth,
  desiredHeight: cabinetHeight,
  desiredDepth: cabinetDepth,
  desiredPlintHeight: plinthHeight,
  selectedColor,
}) => {
  const { topPanelPivot, plinthPanelPivot } = useMemo(() => {
    if (!verticalPanelSource || !horizontalPanelSource) {
      return {
        topPanelPivot: null as THREE.Object3D | null,
        plinthPanelPivot: null as THREE.Object3D | null,
      }
    }

    const topPanelModel = cloneWithIndependentMaterials(verticalPanelSource)
    const plinthPanelModel = cloneWithIndependentMaterials(
      horizontalPanelSource
    )

    // Anchor each part to bottom-front using a pivot wrapper
    const topPanelPivotNode = createPivotAnchored(topPanelModel, {
      anchorY: 'min',
      anchorZ: 'min',
    })
    const plinthPanelPivotNode = createPivotAnchored(plinthPanelModel, {
      anchorY: 'min',
      anchorZ: 'min',
    })

    return {
      topPanelPivot: topPanelPivotNode,
      plinthPanelPivot: plinthPanelPivotNode,
    }
  }, [verticalPanelSource, horizontalPanelSource])

  useEffect(() => {
    if (!topPanelPivot || !plinthPanelPivot) return

    const {
      panelThickness: panelThicknessUnits,
      defaultScale: unitScaleFactor,
    } = FURNITURE_CONFIG

    plinthPanelPivot.scale.set(
      cabinetWidth * unitScaleFactor,
      plinthHeight * unitScaleFactor,
      panelThicknessUnits * unitScaleFactor
    )
    plinthPanelPivot.position.set(0, 0, cabinetDepth - panelThicknessUnits)

    topPanelPivot.scale.set(
      cabinetWidth * unitScaleFactor,
      panelThicknessUnits * unitScaleFactor,
      cabinetDepth * unitScaleFactor
    )
    topPanelPivot.position.set(0, cabinetHeight - panelThicknessUnits, 0)

    topPanelPivot.updateMatrixWorld(true)
    plinthPanelPivot.updateMatrixWorld(true)
  }, [
    topPanelPivot,
    plinthPanelPivot,
    cabinetWidth,
    cabinetHeight,
    cabinetDepth,
    plinthHeight,
  ])

  useEffect(() => {
    if (!topPanelPivot || !plinthPanelPivot) return
    applyColorToObject(topPanelPivot, selectedColor)
    applyColorToObject(plinthPanelPivot, selectedColor)
  }, [topPanelPivot, plinthPanelPivot, selectedColor])

  useEffect(() => {
    return () => {
      if (topPanelPivot) disposeObject(topPanelPivot)
      if (plinthPanelPivot) disposeObject(plinthPanelPivot)
    }
  }, [topPanelPivot, plinthPanelPivot])

  if (!topPanelPivot || !plinthPanelPivot) return null

  return (
    <group>
      <primitive object={plinthPanelPivot} />
      <primitive object={topPanelPivot} />
    </group>
  )
}

export const TopAndPlinth = memo(TopAndPlinthComponent)
