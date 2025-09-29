import React, { Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * StandBuilder2 loads three GLB components (front, vertical, horizontal) and
 * places them into the scene as a single grouped object. For now, the models
 * are loaded at their original origins/transformations. If they already have
 * the correct relative coordinates inside each file, they should assemble
 * automatically. Otherwise, adjust the positions below as needed.
 */
export const StandBuilder2: React.FC = () => {
  const frontUrl =
    'https://media.tylko.com/cloudinary/image/upload/v1/renderer/geometry/front_sample.glb'
  const verticalUrl =
    'https://media.tylko.com/cloudinary/image/upload/v1/renderer/geometry/vertical_sample.glb'
  const horizontalUrl =
    'https://media.tylko.com/cloudinary/image/upload/v1/renderer/geometry/horizontal_sample.glb'

  //  const frontUrl =
  //   '/assets/3d-models/front_sample.glb'
  // const verticalUrl =
  //   '/assets/3d-models/vertical_sample.glb'
  // const horizontalUrl =
  '/assets/3d-models/horizontal_sample.glb'


  // Load each GLB – useGLTF caches internally so duplicate loads are cheap
  const { scene: frontScene } = useGLTF(frontUrl)
  const { scene: verticalScene } = useGLTF(verticalUrl)
  const { scene: horizontalScene } = useGLTF(horizontalUrl)

  // Optionally ensure all materials render in correct colour-space
  React.useEffect(() => {
    ;[frontScene, verticalScene, horizontalScene].forEach((sc) => {
      sc.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true
          const material = mesh.material as THREE.MeshStandardMaterial
          if (material && material.map) {
            material.map.colorSpace = THREE.SRGBColorSpace
          }
        }
      })
    })
  }, [frontScene, verticalScene, horizontalScene])

  // NEW: Scale all sub-models uniformly so that they are 100× bigger
  React.useEffect(() => {
    const defaultSampleDepth = 2;
    const standWidth = 80;
    const standHeight = 70;
    const standDepth = 40;

    frontScene.scale.setScalar(100)

    const box = new THREE.Box3().setFromObject(frontScene)
    const size = new THREE.Vector3()
    box.getSize(size)
    console.log(`FRONT: \n  Width: ${size.x.toFixed(2)}\n  Height: ${size.y.toFixed(2)}\n  Depth: ${size.z.toFixed(2)}`)

    frontScene.scale.set(standWidth/100,standHeight/100, defaultSampleDepth/100)

    const box2 = new THREE.Box3().setFromObject(frontScene)
    const size2 = new THREE.Vector3()
    box.getSize(size2)
    console.log(`FRONT 2: \n  Width: ${size2.x.toFixed(2)}\n  Height: ${size2.y.toFixed(2)}\n  Depth: ${size2.z.toFixed(2)}`)

    frontScene.position.set(-30, 30, 10)

    verticalScene.scale.setScalar(100)
    verticalScene.position.set(0, 30, 10)

    horizontalScene.scale.setScalar(100)
    horizontalScene.position.set(30, 30, 10)

    // const scaleFactor = 500
    // ;[frontScene, verticalScene, horizontalScene].forEach((sc) => {
    //   sc.scale.setScalar(scaleFactor)
    // })
  }, [frontScene, verticalScene, horizontalScene])

  // ---------------------------------------------------------------------------
  // Debug: log bounding-box width and position of each loaded sub-model
  React.useEffect(() => {
    const logInfo = (name: string, scene: THREE.Object3D) => {
      // Compute the bounding box to determine size
      const box = new THREE.Box3().setFromObject(scene)
      const size = new THREE.Vector3()
      box.getSize(size)
      const width = size.x // X dimension represents width assuming +X → right
      const { x, y, z } = scene.position
      // Print a concise summary to the console
      console.log(`[StandBuilder2] ${name}: width=${width.toFixed(2)}, position=(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`)
    }

    logInfo('front', frontScene)
    logInfo('vertical', verticalScene)
    logInfo('horizontal', horizontalScene)
  }, [frontScene, verticalScene, horizontalScene])

  return (
    <Suspense fallback={null}>
      <group>
        <primitive object={frontScene} />
        <primitive object={verticalScene} />
        <primitive object={horizontalScene} />
      </group>
    </Suspense>
  )
}

// Preload the assets so that they are cached before the component mounts
useGLTF.preload(
  'https://media.tylko.com/cloudinary/image/upload/v1/renderer/geometry/front_sample.glb'
)
useGLTF.preload(
  'https://media.tylko.com/cloudinary/image/upload/v1/renderer/geometry/vertical_sample.glb'
)
useGLTF.preload(
  'https://media.tylko.com/cloudinary/image/upload/v1/renderer/geometry/horizontal_sample.glb'
) 