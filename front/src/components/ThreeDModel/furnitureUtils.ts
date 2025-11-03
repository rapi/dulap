import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { PBRTextures, getColorItem, colorDictionary } from '~/utils/colorDictionary'

// Global texture cache to avoid reloading textures
const textureCache = new Map<string, THREE.Texture>()

// Preload all PBR textures at startup
export const preloadPBRTextures = (): void => {
  const textureLoader = new THREE.TextureLoader()
  
  colorDictionary.forEach((colorItem) => {
    if (colorItem.pbrTextures) {
      const textures = colorItem.pbrTextures
      
      // Preload all texture types
      Object.entries(textures).forEach(([key, url]) => {
        if (url && !textureCache.has(url)) {
          const texture = textureLoader.load(url)
          
          // Configure texture based on type
          if (key === 'diffuse') {
            texture.colorSpace = THREE.SRGBColorSpace
          }
          
          // Set wrapping mode (repeat will be calculated per mesh)
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping

          textureCache.set(url, texture)
        }
      })
    }
  })
}

// Get texture from cache (must be preloaded first)
const getCachedTexture = (url: string): THREE.Texture | null => {
  return textureCache.get(url) || null
}

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
      
      materials.forEach((oldMaterial) => {
        // Dispose old material and its textures completely
        if (oldMaterial && oldMaterial instanceof THREE.Material) {
          // Dispose all texture maps if they exist
          if ('map' in oldMaterial && oldMaterial.map instanceof THREE.Texture) oldMaterial.map.dispose()
          if ('normalMap' in oldMaterial && oldMaterial.normalMap instanceof THREE.Texture) oldMaterial.normalMap.dispose()
          if ('roughnessMap' in oldMaterial && oldMaterial.roughnessMap instanceof THREE.Texture) oldMaterial.roughnessMap.dispose()
          if ('metalnessMap' in oldMaterial && oldMaterial.metalnessMap instanceof THREE.Texture) oldMaterial.metalnessMap.dispose()
          if ('aoMap' in oldMaterial && oldMaterial.aoMap instanceof THREE.Texture) oldMaterial.aoMap.dispose()
          if ('displacementMap' in oldMaterial && oldMaterial.displacementMap instanceof THREE.Texture) oldMaterial.displacementMap.dispose()
          oldMaterial.dispose()
        }
      })
      
      // Create fresh material with solid color only (no textures)
      const solidColorMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.0,
      })
      
      mesh.material = solidColorMaterial
      mesh.material.needsUpdate = true
    }
  })
}

/**
 * Apply PBR textures to an object with realistic material properties
 * Based on Three.js tutorial principles for PBR rendering
 */
export const applyPBRTexturesToObject = (
  obj: THREE.Object3D,
  pbrTextures: PBRTextures,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fallbackColor?: string
): void => {
  // Get textures from cache (already preloaded)
  const diffuseTexture = getCachedTexture(pbrTextures.diffuse)
  const normalTexture = getCachedTexture(pbrTextures.normal)
  const roughnessTexture = getCachedTexture(pbrTextures.roughness)
  const aoTexture = pbrTextures.aoRoughMetal ? getCachedTexture(pbrTextures.aoRoughMetal) : null
  // const displacementTexture = pbrTextures.displacement ? getCachedTexture(pbrTextures.displacement) : null
  
  // If textures not preloaded, log warning and return
  if (!diffuseTexture || !normalTexture || !roughnessTexture) {
    console.warn('⚠️ Textures not preloaded! Call preloadPBRTextures() first')
    return
  }
  
  // Apply textures to all meshes in the object
  obj.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      const mesh = o
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      
      materials.forEach((oldMaterial) => {
        // Dispose old material and its textures
        if (oldMaterial && oldMaterial instanceof THREE.Material) {
          if ('map' in oldMaterial && oldMaterial.map instanceof THREE.Texture) oldMaterial.map.dispose()
          if ('normalMap' in oldMaterial && oldMaterial.normalMap instanceof THREE.Texture) oldMaterial.normalMap.dispose()
          if ('roughnessMap' in oldMaterial && oldMaterial.roughnessMap instanceof THREE.Texture) oldMaterial.roughnessMap.dispose()
          if ('aoMap' in oldMaterial && oldMaterial.aoMap instanceof THREE.Texture) oldMaterial.aoMap.dispose()
          if ('displacementMap' in oldMaterial && oldMaterial.displacementMap instanceof THREE.Texture) oldMaterial.displacementMap.dispose()
          oldMaterial.dispose()
        }
      })
      
      // Calculate mesh size for proper texture scaling
      mesh.geometry.computeBoundingBox()
      const bbox = mesh.geometry.boundingBox
      if (bbox) {
        // Get base geometry dimensions
        const baseWidth = bbox.max.x - bbox.min.x
        const baseHeight = bbox.max.y - bbox.min.y
        const baseDepth = bbox.max.z - bbox.min.z
        
        // Update world matrix to get accumulated transforms from parent hierarchy
        mesh.updateMatrixWorld(true)
        
        // Extract world scale from the matrix (includes parent scales)
        const worldScale = new THREE.Vector3()
        mesh.getWorldScale(worldScale)
        
        // Apply world scale to get actual dimensions
        const width = baseWidth * Math.abs(worldScale.x)
        const height = baseHeight * Math.abs(worldScale.y)
        const depth = baseDepth * Math.abs(worldScale.z)
        
        // Determine the actual surface dimensions based on which face is largest
        // This ensures proper texture mapping to the visible surface
        const areas = {
          xy: width * height,    // Front/back face
          xz: width * depth,     // Top/bottom face
          yz: height * depth,    // Left/right face
        }
        
        // Find the largest face (the one most likely to be visible)
        const largestFace = Object.keys(areas).reduce((a, b) => 
          areas[a as keyof typeof areas] > areas[b as keyof typeof areas] ? a : b
        ) as keyof typeof areas
        
        // Map dimensions to UV coordinates based on the largest face
        let uDimension: number, vDimension: number
        if (largestFace === 'xy') {
          uDimension = width
          vDimension = height
        } else if (largestFace === 'xz') {
          uDimension = width
          vDimension = depth
        } else { // yz
          uDimension = depth
          vDimension = height
        }
        
        // Scale texture: assume texture represents 50cm of real wood
        // Adjust repeat based on actual surface dimensions
        const textureScaleCm = 50 // texture represents 50cm of wood
        const repeatX = Math.max(0.5, uDimension / textureScaleCm)
        const repeatY = Math.max(0.5, vDimension / textureScaleCm)
        
        // Clone textures for this mesh to avoid affecting other meshes
        const meshDiffuse = diffuseTexture.clone()
        const meshNormal = normalTexture.clone()
        const meshRoughness = roughnessTexture.clone()
        const meshAO = aoTexture ? aoTexture.clone() : null
        
        // Ensure wrapping mode is set (should inherit from parent, but be explicit)
        meshDiffuse.wrapS = meshDiffuse.wrapT = THREE.RepeatWrapping
        meshNormal.wrapS = meshNormal.wrapT = THREE.RepeatWrapping
        meshRoughness.wrapS = meshRoughness.wrapT = THREE.RepeatWrapping
        if (meshAO) {
          meshAO.wrapS = meshAO.wrapT = THREE.RepeatWrapping
        }
        
        // Apply proper repeat for this mesh size
        meshDiffuse.repeat.set(repeatX, repeatY)
        meshNormal.repeat.set(repeatX, repeatY)
        meshRoughness.repeat.set(repeatX, repeatY)
        if (meshAO) meshAO.repeat.set(repeatX, repeatY)
        
        meshDiffuse.needsUpdate = true
        meshNormal.needsUpdate = true
        meshRoughness.needsUpdate = true
        if (meshAO) meshAO.needsUpdate = true
        
        // Create new PBR material with properly scaled textures
        const pbrMaterial = new THREE.MeshStandardMaterial({
          map: meshDiffuse,                  // Base color/albedo
          color: pbrTextures.colorTint || '#ffffff', // Color tint multiplied with texture
          normalMap: meshNormal,              // Surface detail (fake geometry)
          normalScale: new THREE.Vector2(0.5, 0.5), // Reduce normal map intensity for better appearance
          roughnessMap: meshRoughness,        // Roughness control
          roughness: 1.0,                     // Full roughness map influence
          metalness: 0.0,                     // Non-metallic (wood)
          aoMap: meshAO || undefined,         // Ambient occlusion (optional)
          aoMapIntensity: meshAO ? 0.5 : 0,   // Reduce AO intensity
        })
        
        mesh.material = pbrMaterial
      } else {
        // Fallback if no bounding box
        const pbrMaterial = new THREE.MeshStandardMaterial({
          map: diffuseTexture,
          color: pbrTextures.colorTint || '#ffffff',
          normalMap: normalTexture,
          normalScale: new THREE.Vector2(0.5, 0.5),
          roughnessMap: roughnessTexture,
          roughness: 1.0,
          metalness: 0.0,
          aoMap: aoTexture || undefined,
          aoMapIntensity: aoTexture ? 0.5 : 0,
        })
        mesh.material = pbrMaterial
      }
      
      mesh.material.needsUpdate = true
      
      // Ensure geometry has UV2 attribute for AO map if needed
      if (aoTexture && mesh.geometry && !mesh.geometry.attributes.uv2) {
        mesh.geometry.setAttribute('uv2', mesh.geometry.attributes.uv)
      }
    }
  })
}

/**
 * Smart material application: uses PBR textures if available, otherwise applies solid color
 * This is the recommended function to use for furniture parts
 * 
 * @param obj - The 3D object to apply material to
 * @param colorNameOrHex - Color name (e.g., "Natural Acacia") or hex code (e.g., "#d4b896")
 */
export const applyMaterialToObject = (obj: THREE.Object3D, colorNameOrHex: string): void => {
  // Try to get color item from dictionary (searches by name AND hex code)
  const colorItem = getColorItem(colorNameOrHex)
  
  // If color item has PBR textures, use them for realistic rendering
  if (colorItem?.pbrTextures) {
    applyPBRTexturesToObject(obj, colorItem.pbrTextures, colorItem.hexCode)
  } else {
    // Fallback to solid color (either from dictionary or direct hex)
    const hexColor = colorItem?.hexCode || colorNameOrHex
    applyColorToObject(obj, hexColor)
  }
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