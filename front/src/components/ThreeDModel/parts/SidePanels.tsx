import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { useGLTF } from '@react-three/drei'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { anchorGeometryToBottom, anchorGeometryToWall, applyColorToObject } from '../furnitureUtils'

interface SidePanelsProps {
  horizontalUrl: string
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  selectedColor: string
}

export const SidePanels: React.FC<SidePanelsProps> = ({
  horizontalUrl,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  selectedColor,
}) => {
  const { scene: horizontalSample } = useGLTF(horizontalUrl)

  const { leftSide, rightSide } = useMemo(() => {
    if (!horizontalSample) return { leftSide: null, rightSide: null }

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

    const left = prepareComponent(SkeletonUtils.clone(horizontalSample))
    const right = prepareComponent(SkeletonUtils.clone(horizontalSample))
    return { leftSide: left, rightSide: right }
  }, [horizontalSample])

  useEffect(() => {
    if (!leftSide || !rightSide) return

    const { panelThickness, defaultScale } = FURNITURE_CONFIG
    const sidePanelScale = [
      panelThickness * defaultScale,
      (desiredHeight - panelThickness) * defaultScale,
      (desiredDepth - panelThickness) * defaultScale,
    ] as [number, number, number]

    leftSide.scale.set(...sidePanelScale)
    rightSide.scale.set(...sidePanelScale)

    leftSide.position.set(-desiredWidth / 2 + panelThickness / 2, 0, 0)
    rightSide.position.set(desiredWidth / 2 - panelThickness / 2, 0, 0)

    leftSide.updateMatrixWorld(true)
    rightSide.updateMatrixWorld(true)
  }, [leftSide, rightSide, desiredWidth, desiredHeight, desiredDepth])

  useEffect(() => {
    if (!leftSide || !rightSide) return
    applyColorToObject(leftSide, selectedColor)
    applyColorToObject(rightSide, selectedColor)
  }, [leftSide, rightSide, selectedColor])

  if (!leftSide || !rightSide) return null

  return (
    <group>
      <primitive object={leftSide} />
      <primitive object={rightSide} />
    </group>
  )
}
