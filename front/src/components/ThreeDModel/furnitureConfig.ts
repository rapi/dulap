export const FURNITURE_CONFIG = {
  panelThickness: 2,  // толщика панелей
  panelSpacing: 0.2,  // расстояние между ящиками
  maxRenderedDrawers: 5,
  defaultScale: 10,

  // ручка расположена на 4 см ниже от верхней части ящика
  handleOnTheDrawerTopOffset: 4,
  // сама коробка внутреннего ящика меньше на 5 см по высоте от размера всего ящика
  drawerInsidePanelsOffset: 5,
} as const

export type FurnitureConfig = typeof FURNITURE_CONFIG

export enum OpeningType {
  RoundHandle = 'maner',
  ProfileHandle = 'profile-handle',
  Push = 'push',
}
