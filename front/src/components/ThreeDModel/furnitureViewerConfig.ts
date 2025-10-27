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
}

// Default configuration for most furniture types
const DEFAULT_CONFIG: FurnitureViewerConfig = {
  backgroundScale: [100, 45, 45],
  cameraPosition: [0, 50, 250],
  minDistance: 100,
  maxDistance: 250,
  minAzimuthAngle: -Math.PI / 2 + 0.5,
  maxAzimuthAngle: Math.PI / 2 - 0.5,
  minPolarAngle: 0.3,
  maxPolarAngle: Math.PI / 2 + 0.2,
  target: [0, 50, 0],
  getShadowManXPosition: () => -100,
}

// Wardrobe-specific configuration
const WARDROBE_CONFIG: FurnitureViewerConfig = {
  backgroundScale: [200, 90, 90],
  cameraPosition: [0, 115, 250],
  minDistance: 500,
  maxDistance: 500,
  minAzimuthAngle: -Math.PI / 2 + Math.PI / 5,
  maxAzimuthAngle: Math.PI / 2 - Math.PI / 5,
  minPolarAngle: Math.PI / 4,
  maxPolarAngle: Math.PI / 2,
  target: [0, 100, 0],
  getShadowManXPosition: (width: number) => -width / 2 - 50,
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
