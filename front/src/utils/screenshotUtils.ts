import * as THREE from 'three'
import { FURNITURE_CONFIG } from '~/components/ThreeDModel/furnitureConfig'

/**
 * Prepares scene for screenshot: hides background/shadow man, shows ground shadow
 * @param scene The Three.js Scene instance
 * @returns Array of objects that were modified, to restore later
 */
export function prepareSceneForScreenshot(scene: THREE.Scene): Array<{ object: THREE.Object3D; originalVisible: boolean }> {
  const modifiedObjects: Array<{ object: THREE.Object3D; originalVisible: boolean }> = []
  
  // Traverse scene to find background, shadow man, and ground shadow objects
  scene.traverse((object) => {
    if (object instanceof THREE.Object3D) {
      // Check userData markers set by GLBModel and GroundShadow components
      const isBackground = object.userData.isBackground
      const isShadowMan = object.userData.isShadowMan
      const isGroundShadow = object.userData.isGroundShadow
      
      // Hide background and shadow man
      if (isBackground || isShadowMan) {
        if (object.visible) {
          modifiedObjects.push({ object, originalVisible: object.visible })
          object.visible = false
        }
      }
      
      // Show ground shadow (it's hidden by default)
      if (isGroundShadow) {
        modifiedObjects.push({ object, originalVisible: object.visible })
        object.visible = true
      }
    }
  })
  
  return modifiedObjects
}

/**
 * Restores visibility of previously modified objects
 * @param modifiedObjects Array of objects to restore
 */
export function restoreSceneVisibility(modifiedObjects: Array<{ object: THREE.Object3D; originalVisible: boolean }>): void {
  modifiedObjects.forEach(({ object, originalVisible }) => {
    object.visible = originalVisible
  })
}

/**
 * Closes all doors in the scene by finding hinge groups and setting them to closed state
 * @param scene The Three.js Scene instance
 */
export function closeAllDoors(scene: THREE.Scene): void {
  const hingeGroups: THREE.Group[] = []
  
  // Traverse scene to find all hinge groups
  scene.traverse((object) => {
    if (object.userData.isHingeGroup && object instanceof THREE.Group) {
      hingeGroups.push(object)
    }
  })
  
  // Close all doors immediately
  hingeGroups.forEach((hingeGroup) => {
    // Set rotation to 0 (closed position)
    hingeGroup.rotation.y = 0
    
    // Find doorGroup child to calculate correct base z-position
    // From Door.tsx: doorGroup.position.z = -zPosition (relative to hingeGroup)
    // Where zPosition = doorDepth - panelThickness (from calculateDoorPositions)
    // So baseZPosition = -doorGroup.position.z
    const doorGroup = hingeGroup.children.find((child) => 
      child.userData.isDoorGroup
    )
    
    if (doorGroup) {
      // Calculate the base z-position from doorGroup's relative position
      // doorGroup.position.z is negative of the base z-position
      const baseZPosition = -doorGroup.position.z
      
      // Set to closed position (remove any offset that might have been added by animation)
      hingeGroup.position.z = baseZPosition
    }
    
    // Update matrix to apply changes immediately
    hingeGroup.updateMatrixWorld(true)
  })
}

/**
 * Captures a screenshot from a Three.js WebGLRenderer
 * @param renderer The Three.js WebGLRenderer instance
 * @param scene The Three.js Scene instance
 * @param camera The Three.js Camera instance
 * @param format The image format ('image/png' or 'image/jpeg')
 * @param quality Quality for JPEG (0-1), ignored for PNG
 * @returns Base64 encoded image data URL
 */
export function captureScreenshot(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality: number = 0.92
): string {
  // Close all doors before capturing
  closeAllDoors(scene)
  
  // Prepare scene for screenshot: hide background/shadow man, show ground shadow
  const modifiedObjects = prepareSceneForScreenshot(scene)
  
  // Ensure the scene is rendered before capturing
  renderer.render(scene, camera)
  
  // Capture the canvas as data URL
  const dataURL = renderer.domElement.toDataURL(format, quality)
  
  // Restore scene visibility after capture
  restoreSceneVisibility(modifiedObjects)
  
  return dataURL
}

/**
 * Converts a data URL to a base64 string (removes the data URL prefix)
 * @param dataURL The data URL string
 * @returns Base64 string without prefix
 */
export function dataURLToBase64(dataURL: string): string {
  const base64Index = dataURL.indexOf(',')
  return base64Index !== -1 ? dataURL.substring(base64Index + 1) : dataURL
}

/**
 * Converts a base64 string back to a data URL
 * @param base64 The base64 string
 * @param mimeType The MIME type (default: 'image/png')
 * @returns Data URL string
 */
export function base64ToDataURL(base64: string, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${base64}`
}

