import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'

export function createPivotAnchored(
  object: THREE.Object3D,
  { anchorY = 'min', anchorZ = 'min' }: { anchorY?: 'min'|'center'|'max', anchorZ?: 'min'|'center'|'max' } = {}
) {
  const pivot = new THREE.Group();
  pivot.add(object);

  const box = new THREE.Box3().setFromObject(object);
  const getAnchor = (min: number, max: number, kind: 'min'|'center'|'max') =>
    kind === 'min' ? min : kind === 'max' ? max : (min + max) * 0.5;

  const ay = getAnchor(box.min.y, box.max.y, anchorY);
  const az = getAnchor(box.min.z, box.max.z, anchorZ);

  object.position.y -= ay;
  object.position.z -= az;

  pivot.updateMatrixWorld(true);
  return pivot;
}

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

// Clone an Object3D tree, deeply cloning materials to avoid shared state across parts
export const cloneWithIndependentMaterials = (
  sourceObject: THREE.Object3D,
  { castShadow = true, receiveShadow = true }: { castShadow?: boolean; receiveShadow?: boolean } = {}
): THREE.Object3D => {
  const clonedRoot = SkeletonUtils.clone(sourceObject) as THREE.Object3D
  clonedRoot.traverse((node) => {
    const meshNode = node as THREE.Mesh
    if (meshNode.isMesh) {
      const originalMaterial = meshNode.material
      if (originalMaterial) {
        meshNode.material = Array.isArray(originalMaterial)
          ? originalMaterial.map((materialInstance) => materialInstance.clone())
          : originalMaterial.clone()
      }
      meshNode.castShadow = castShadow
      meshNode.receiveShadow = receiveShadow
    }
  })
  return clonedRoot
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