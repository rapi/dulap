/**
 * Configuration for FurnitureViewer camera and controls based on furniture type
 */

export interface FurnitureViewerConfig {
  backgroundScale: [number, number, number]
  cameraPosition: [number, number, number]
  minDistance: number
  maxDistance: number
  minAzimuthAngle: number
  maxAzimuthAngle: number
  minPolarAngle: number
  maxPolarAngle: number
  target: [number, number, number]
  getShadowManXPosition: (width: number) => number
  fogColor?: string
  fogNear?: number
  fogFar?: number
}

// Default configuration for most furniture types
const DEFAULT_CONFIG: FurnitureViewerConfig = {
  backgroundScale: [200, 90, 90],
  cameraPosition: [-100, 100, 150], // Left-side view: camera on left (negative X), slightly in front
  minDistance: 100,
  maxDistance: 500,
  minAzimuthAngle: -Math.PI / 2 + 0.5,
  maxAzimuthAngle: Math.PI / 2 - 0.5,
  minPolarAngle: 0.3,
  maxPolarAngle: Math.PI / 2 + 0.2,
  target: [0, 50, 0],
  getShadowManXPosition: (width: number) => -width / 2 - 50,
  fogColor: '#f5f5f5',
  fogNear: 500, // Start fog well beyond furniture (camera is at z=350, furniture at ~400 units distance)
  fogFar: 900, // Extend fog further to fade distant background edges
}

// Wardrobe-specific configuration
// Left-side view for wardrobe: camera positioned on the left side
const WARDROBE_CONFIG: FurnitureViewerConfig = {
  backgroundScale: [250, 120, 150], // Larger scale to prevent edge visibility with distant camera
  cameraPosition: [-150, 170, 350], // Left-side view: camera on left (negative X), slightly in front
  minDistance: 200,
  maxDistance: 500,
  minAzimuthAngle: -Math.PI / 2 + Math.PI / 5,
  maxAzimuthAngle: Math.PI / 2 - Math.PI / 5,
  minPolarAngle: Math.PI / 4,
  maxPolarAngle: Math.PI / 2,
  target: [0, 100, 0],
  getShadowManXPosition: (width: number) => -width / 2 - 50,
  fogColor: '#f5f5f5',
  fogNear: 500, // Start fog well beyond furniture (camera is at z=350, furniture at ~400 units distance)
  fogFar: 900, // Extend fog further to fade distant background edges
}

// Configuration mapping by furniture type
export const FURNITURE_VIEWER_CONFIGS: Record<string, FurnitureViewerConfig> = {
  wardrobe: WARDROBE_CONFIG,
  stand: DEFAULT_CONFIG,
  'tv-stand': DEFAULT_CONFIG,
  bedside: DEFAULT_CONFIG,
  'office-table': DEFAULT_CONFIG,
  greenwall: DEFAULT_CONFIG,
  storage: DEFAULT_CONFIG,
}

/**
 * Get viewer configuration for a specific furniture type
 */
export function getViewerConfig(
  furnitureType?: string
): FurnitureViewerConfig {
  return (
    (furnitureType && FURNITURE_VIEWER_CONFIGS[furnitureType]) ||
    DEFAULT_CONFIG
  )
}
