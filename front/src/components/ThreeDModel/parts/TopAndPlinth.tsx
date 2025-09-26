import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { anchorGeometryToBottom, anchorGeometryToWall, applyColorToObject, disposeObject } from '../furnitureUtils'

interface TopAndPlinthProps {
  verticalScene: THREE.Object3D
  horizontalScene: THREE.Object3D
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  selectedColor: string
}

export const TopAndPlinth: React.FC<TopAndPlinthProps> = ({
  verticalScene,
  horizontalScene,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  desiredPlintHeight,
  selectedColor,
}) => {

  const { top, plinth } = useMemo(() => {
    if (!verticalScene || !horizontalScene) return { top: null, plinth: null }

    const prepareComponent = (component: THREE.Object3D): THREE.Object3D => {
      component.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const mesh = o as THREE.Mesh
          if (mesh.material) {
            mesh.material = Array.isArray(mesh.material)
              ? mesh.material.map((m) => m.clone())
              : mesh.material.clone()
          }
          anchorGeometryToBottom(mesh)
          anchorGeometryToWall(mesh)
          mesh.uuid = THREE.MathUtils.generateUUID()
          mesh.castShadow = true
          mesh.receiveShadow = true
          mesh.matrixAutoUpdate = true
          mesh.updateMatrix()
        }
      })
      component.uuid = THREE.MathUtils.generateUUID()
      component.updateMatrixWorld(true)
      return component
    }

    const topPanel = prepareComponent(SkeletonUtils.clone(verticalScene))
    const plinthPanel = prepareComponent(SkeletonUtils.clone(horizontalScene))
    return { top: topPanel, plinth: plinthPanel }
  }, [verticalScene, horizontalScene])

  useEffect(() => {
    if (!top || !plinth) return

    const { panelThickness, defaultScale } = FURNITURE_CONFIG

    // Plinth
    plinth.scale.set(
      desiredWidth * defaultScale,
      desiredPlintHeight * defaultScale,
      panelThickness * defaultScale
    )
    plinth.position.set(0, 0, desiredDepth - panelThickness)

    // Top panel
    top.scale.set(
      desiredWidth * defaultScale,
      panelThickness * defaultScale,
      desiredDepth * defaultScale
    )
    top.position.set(0, desiredHeight - panelThickness, 0)

    top.updateMatrixWorld(true)
    plinth.updateMatrixWorld(true)
  }, [top, plinth, desiredWidth, desiredHeight, desiredDepth, desiredPlintHeight])

  useEffect(() => {
    if (!top || !plinth) return
    applyColorToObject(top, selectedColor)
    applyColorToObject(plinth, selectedColor)
  }, [top, plinth, selectedColor])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (top) disposeObject(top)
      if (plinth) disposeObject(plinth)
    }
  }, [top, plinth])

  if (!top || !plinth) return null

  return (
    <group>
      <primitive object={plinth} />
      <primitive object={top} />
    </group>
  )
}
