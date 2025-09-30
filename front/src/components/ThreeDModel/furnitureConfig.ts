export const FURNITURE_CONFIG = {
  panelThickness: 2,
  drawerSpacing: 0.1,
  minDrawerHeight: 10,
  maxRenderedDrawers: 5,
  defaultScale: 10,
} as const

export type FurnitureConfig = typeof FURNITURE_CONFIG
