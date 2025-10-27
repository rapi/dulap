import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import {
  applyColorToObject,
  cloneWithIndependentMaterials,
  createPivotAnchored,
  disposeObject,
} from '~/components/ThreeDModel/furnitureUtils'

export interface PanelConfig {
  scale: [number, number, number]
  position: [number, number, number]
  color: string
  anchor?: {
    anchorY?: 'min' | 'center' | 'max'
    anchorZ?: 'min' | 'center' | 'max'
  }
  rotation?: [number, number, number]
}

/**
 * Hook for creating and managing a 3D panel object
 * Handles cloning, scaling, positioning, coloring, and disposal
 * 
 * @param sourceObject - The source THREE.Object3D to clone
 * @param config - Configuration for the panel
 * @returns The configured panel object or null
 * 
 * @example
 * const leftPanel = usePanel(horizontalPanelObject, {
 *   scale: [thickness, height, depth],
 *   position: [-width / 2, 0, 0],
 *   color: selectedColor,
 *   anchor: { anchorY: 'min', anchorZ: 'min' }
 * })
 * 
 * // In render:
 * {leftPanel && <primitive object={leftPanel} />}
 */
export const usePanel = (
  sourceObject: THREE.Object3D | null,
  config: PanelConfig
): THREE.Object3D | null => {
  // Create the panel object
  // Only recreate when source changes, NOT when config.anchor changes
  // This prevents unnecessary recreation and flickering
  const panel = useMemo(() => {
    if (!sourceObject) return null

    const model = cloneWithIndependentMaterials(sourceObject)
    const pivotedPanel = createPivotAnchored(
      model,
      config.anchor ?? { anchorY: 'min', anchorZ: 'min' }
    )
    
    return pivotedPanel
  }, [sourceObject]) // Removed config.anchor from dependencies

  // Scale, position, and rotate the panel
  useEffect(() => {
    if (!panel) return
    
    panel.scale.set(...config.scale)
    panel.position.set(...config.position)
    
    if (config.rotation) {
      panel.rotation.set(...config.rotation)
    }
    
    panel.updateMatrixWorld(true)
  }, [panel, config.scale, config.position, config.rotation])

  // Apply color
  useEffect(() => {
    if (!panel) return
    applyColorToObject(panel, config.color)
  }, [panel, config.color])

  // Cleanup on unmount or when panel changes
  useEffect(() => {
    return () => {
      if (panel) {
        disposeObject(panel)
      }
    }
  }, [panel])

  return panel
}

/**
 * Hook for creating multiple panels with the same source object
 * Useful for creating pairs of panels like left/right sides
 * 
 * This implementation properly follows the Rules of Hooks by creating all panels
 * in a single useMemo instead of calling usePanel multiple times in a loop.
 * 
 * @param sourceObject - The source THREE.Object3D to clone
 * @param configs - Array of configurations for each panel
 * @returns Array of configured panel objects
 * 
 * @example
 * const [leftPanel, rightPanel] = usePanels(horizontalPanelObject, [
 *   { scale: [thickness, height, depth], position: [-width / 2, 0, 0], color: selectedColor },
 *   { scale: [thickness, height, depth], position: [width / 2, 0, 0], color: selectedColor }
 * ])
 */
export const usePanels = (
  sourceObject: THREE.Object3D | null,
  configs: PanelConfig[]
): (THREE.Object3D | null)[] => {
  // Create all panels at once in a single useMemo
  // Only recreate when the source object changes, NOT when configs change
  const panels = useMemo(() => {
    if (!sourceObject) return configs.map(() => null)
    
    return configs.map(config => {
      const model = cloneWithIndependentMaterials(sourceObject)
      const pivotedPanel = createPivotAnchored(
        model,
        config.anchor ?? { anchorY: 'min', anchorZ: 'min' }
      )
      return pivotedPanel
    })
  }, [sourceObject]) // Only depend on sourceObject to prevent recreation

  // Apply scale, position, and rotation to all panels
  useEffect(() => {
    panels.forEach((panel, index) => {
      if (!panel) return
      
      const config = configs[index]
      panel.scale.set(...config.scale)
      panel.position.set(...config.position)
      
      if (config.rotation) {
        panel.rotation.set(...config.rotation)
      }
      
      panel.updateMatrixWorld(true)
    })
  }, [panels, configs])

  // Apply color to all panels
  useEffect(() => {
    panels.forEach((panel, index) => {
      if (!panel) return
      const config = configs[index]
      applyColorToObject(panel, config.color)
    })
  }, [panels, configs])

  // Cleanup all panels on unmount or when panels change
  useEffect(() => {
    return () => {
      panels.forEach(panel => {
        if (panel) {
          disposeObject(panel)
        }
      })
    }
  }, [panels])

  return panels
}
