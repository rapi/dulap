import * as THREE from 'three'

export const anchorGeometryToBottom = (mesh: THREE.Mesh): void => {
  mesh.geometry = mesh.geometry.clone()
  mesh.geometry.computeBoundingBox()
  const minY = mesh.geometry.boundingBox!.min.y
  mesh.geometry.translate(0, -minY, 0)
}

export const anchorGeometryToWall = (mesh: THREE.Mesh): void => {
  mesh.geometry = mesh.geometry.clone()
  mesh.geometry.computeBoundingBox()
  const minZ = mesh.geometry.boundingBox!.min.z
  mesh.geometry.translate(0, 0, -minZ)
}

export const applyColorToObject = (obj: THREE.Object3D, color: string): void => {
  obj.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      const mesh = o as THREE.Mesh
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((mat) => {
        if (mat && 'color' in mat && mat.color instanceof THREE.Color) {
          mat.color.set(color)
          mat.needsUpdate = true
        }
      })
    }
  })
}

// Dispose of geometries and materials to free GPU memory
export const disposeObject = (obj: THREE.Object3D): void => {
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      
      if (mesh.geometry) {
        mesh.geometry.dispose()
      }
      
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        materials.forEach((mat) => {
          if (mat && mat instanceof THREE.Material) {
            // Dispose textures if any
            const texturedMat = mat as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial | THREE.MeshPhysicalMaterial
            if (texturedMat.map) texturedMat.map.dispose()
            if ('normalMap' in texturedMat && texturedMat.normalMap) texturedMat.normalMap.dispose()
            if ('roughnessMap' in texturedMat && texturedMat.roughnessMap) texturedMat.roughnessMap.dispose()
            if ('metalnessMap' in texturedMat && texturedMat.metalnessMap) texturedMat.metalnessMap.dispose()
            if ('aoMap' in texturedMat && texturedMat.aoMap) texturedMat.aoMap.dispose()
            
            // Dispose material
            mat.dispose()
          }
        })
      }
    }
  })
  
  // Clear from parent if it has one
  if (obj.parent) {
    obj.parent.remove(obj)
  }
}