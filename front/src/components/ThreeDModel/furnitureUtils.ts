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
        if (mat && 'color' in mat && (mat as any).color instanceof THREE.Color) {
          ;(mat as any).color.set(color)
          ;(mat as any).needsUpdate = true
        }
      })
    }
  })
}
