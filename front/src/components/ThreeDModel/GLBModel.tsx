import React, { memo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const GLBModel = memo(function GLBModel({
  modelUrl,
  modelPosition = [0, 0, 0],
  modelScale = 1,
  modelRotation = [0, 0, 0],
  overrideColorHex,
  shouldCastShadow = true,
  shouldReceiveShadow = true,
  forceFlatColorHex,
  useLambertWhiteMaterial,
}: {
  modelUrl: string
  modelPosition?: [number, number, number]
  modelScale?: number | [number, number, number]
  modelRotation?: [number, number, number]
  overrideColorHex?: string
  shouldCastShadow?: boolean
  shouldReceiveShadow?: boolean
  forceFlatColorHex?: string
  useLambertWhiteMaterial?: boolean
}) {
  const { scene: gltfScene } = useGLTF(modelUrl)

  React.useEffect(() => {
    if (!gltfScene) return

    gltfScene.traverse((object3D) => {
      if ((object3D as THREE.Mesh).isMesh) {
        const mesh = object3D as THREE.Mesh

        if (forceFlatColorHex) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => (material as THREE.Material).dispose?.())
          } else {
            (mesh.material as THREE.Material)?.dispose?.()
          }
          mesh.material = new THREE.MeshBasicMaterial({ color: forceFlatColorHex, toneMapped: false })
        } else if (useLambertWhiteMaterial) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => (material as THREE.Material).dispose?.())
          } else {
            (mesh.material as THREE.Material)?.dispose?.()
          }
          mesh.material = new THREE.MeshLambertMaterial({ color: '#ffffff' })
        } else if (overrideColorHex) {
          const initialMaterial = mesh.material as THREE.Material & { color?: THREE.Color }
          if (initialMaterial && 'color' in initialMaterial && initialMaterial.color instanceof THREE.Color) {
            initialMaterial.color.set(overrideColorHex)
          }
        }

        mesh.castShadow = shouldCastShadow
        mesh.receiveShadow = shouldReceiveShadow
      }
    })
  }, [gltfScene, overrideColorHex, shouldCastShadow, shouldReceiveShadow, forceFlatColorHex, useLambertWhiteMaterial])

  return (
    <primitive
      object={gltfScene}
      position={modelPosition as unknown as [number, number, number]}
      scale={
        Array.isArray(modelScale)
          ? (modelScale as unknown as [number, number, number])
          : [modelScale, modelScale, modelScale]
      }
      rotation={modelRotation as unknown as [number, number, number]}
      castShadow={shouldCastShadow}
      receiveShadow={shouldReceiveShadow}
    />
  )
})
