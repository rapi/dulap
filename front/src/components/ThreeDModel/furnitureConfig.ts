export const FURNITURE_CONFIG = {
  // Panel dimensions
  panelThickness: 2, // толщика панелей
  panelSpacing: 0.2, // расстояние между ящиками
  maxRenderedDrawers: 5,

  // Drawer specifics
  handleOnTheDrawerTopOffset: 4, // ручка расположена на 4 см ниже от верхней части ящика
  drawerInsidePanelsOffset: 5, // сама коробка внутреннего ящика меньше на 5 см по высоте от размера всего ящика

  // Drawer margins for rack configurations
  // These values control spacing between drawers in rack zones
  drawerMargin: 0.2, // Margin between drawers (must match panelSpacing)
  drawerBottomMargin: 2, // Margin at the bottom of drawer zone
  drawerTopShelfOverlap: 3, // Extra height for top drawer to cover the separator shelf (2cm shelf + 1cm overlap)

  // Hinge configuration
  hingeOffsetFromEdge: 2,
  hingeDepthOffset: -1,
  hingeAnchorXOffset: -1,
  hingeAnchorYOffset: 1.8,
  hingeTopBottomOffset: 10, // cm offset from top and bottom edges for first/last hinge
  hingeMiddleShift: 5, // cm to shift middle hinge below center for 'offset-middle' rule

  // Animation
  animationLerpSpeed: 0.15,
  doorOpenAngle: Math.PI / 2,

  // Handle colors (moved to handleUtils.ts but kept here for reference)
  handleWhiteColor: '#ffffff',
  handleMetallicColor: '#9c9c9c',
} as const

export type FurnitureConfig = typeof FURNITURE_CONFIG

export enum OpeningType {
  RoundHandle = 'maner',
  ProfileHandle = 'profile-handle',
  ProfileHandleLong = 'profile-handle-long',
  Push = 'push',
}
