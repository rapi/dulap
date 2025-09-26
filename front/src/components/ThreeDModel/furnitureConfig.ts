export const FURNITURE_CONFIG = {
  panelThickness: 2,
  drawerSpacing: 0.1,
  minDrawerHeight: 10,
  maxDrawers: 6,
  defaultScale: 10,
  defaultDrawerCount: 4,
} as const

export type FurnitureConfig = typeof FURNITURE_CONFIG
