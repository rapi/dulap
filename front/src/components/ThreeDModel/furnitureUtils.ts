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
    if (o instanceof THREE.Mesh) {
      const mesh = o
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
  const clonedRoot = SkeletonUtils.clone(sourceObject)
  clonedRoot.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      const meshNode = node
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

export const createPanelPivotWithFlag = (
  sourceObject: THREE.Object3D,
  panelFlagKey: string,
  anchor: { anchorY?: 'min'|'center'|'max'; anchorZ?: 'min'|'center'|'max' } = { anchorY: 'min', anchorZ: 'min' },
): THREE.Object3D => {
  const panelModel = cloneWithIndependentMaterials(sourceObject)
  const panelPivot = createPivotAnchored(panelModel, anchor)
  panelPivot.userData[panelFlagKey] = true
  return panelPivot
}

// Dispose of geometries and materials to free GPU memory
export const disposeObject = (obj: THREE.Object3D): void => {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mesh = child
      
      if (mesh.geometry) {
        mesh.geometry.dispose()
      }
      
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        materials.forEach((mat) => {
          if (mat && mat instanceof THREE.Material) {
            // Dispose textures if any
            if ('map' in mat && mat.map && mat.map instanceof THREE.Texture) mat.map.dispose()
            if ('normalMap' in mat && mat.normalMap && mat.normalMap instanceof THREE.Texture) mat.normalMap.dispose()
            if ('roughnessMap' in mat && mat.roughnessMap && mat.roughnessMap instanceof THREE.Texture) mat.roughnessMap.dispose()
            if ('metalnessMap' in mat && mat.metalnessMap && mat.metalnessMap instanceof THREE.Texture) mat.metalnessMap.dispose()
            if ('aoMap' in mat && mat.aoMap && mat.aoMap instanceof THREE.Texture) mat.aoMap.dispose()
            
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