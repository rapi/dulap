import React, { useEffect, Suspense } from 'react'
import { useLoader, ThreeEvent } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import { StandComponents } from './StandComponents.enum'

interface StandBuilderProps {
  desiredWidth?: number // Target width for the stand in the scene units (default = 80)
}

/**
 * StandBuilder is responsible for building the stand from its individual FBX
 * components. For now, it only places the Bottom component in the scene and
 * scales it so that its total width matches `desiredWidth` (80 units by default).
 */
export const StandBuilder: React.FC<StandBuilderProps> = ({ desiredWidth = 80 }) => {
  // Load the original FBX file just once
  const fbx = useLoader(FBXLoader, '/assets/stand.fbx')

  // Keep bottom mesh in state so component re-renders once it's ready
  const [bottomObject, setBottomObject] = React.useState<THREE.Object3D | null>(null)

  // Extract the components we need out of the FBX once it's available
  useEffect(() => {
    if (!fbx) return

    // We only want to keep ONE copy of the meshes – clone them so we can safely
    // manipulate (scale / position) without touching the original scene graph
    let bottomFound: THREE.Object3D | undefined

    fbx.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const lowerName = child.name.toLowerCase()
      if (lowerName.includes(StandComponents.Bottom)) {
        bottomFound = child.clone()
      }
    })

    if (bottomFound && bottomFound instanceof THREE.Mesh) {
      const originalBox = new THREE.Box3().setFromObject(bottomFound)
      const originalWidth = originalBox.max.x - originalBox.min.x

      if (originalWidth === 0) {
        console.warn('[StandBuilder] Bottom component width is 0 – cannot scale.')
      } else {
        const scaleFactor = desiredWidth / originalWidth
        bottomFound.scale.set(scaleFactor, 1, 1)
      }

      const scaledBox = new THREE.Box3().setFromObject(bottomFound)

      bottomFound.position.z -= scaledBox.min.z
      bottomFound.position.y -= scaledBox.min.y

      const centerX = (scaledBox.max.x + scaledBox.min.x) / 2
      bottomFound.position.x -= centerX

      console.log('[StandBuilder] Bottom component aligned to', bottomFound.position)

      setBottomObject(bottomFound)
    } else {
      console.warn('[StandBuilder] Could not find bottom component in stand.fbx')
    }
  }, [fbx, desiredWidth])

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
  }
  
  if (!bottomObject) return null

  return (
    <Suspense fallback={null}>
      <primitive object={bottomObject} onPointerOver={handlePointerOver} />
    </Suspense>
  )
} 