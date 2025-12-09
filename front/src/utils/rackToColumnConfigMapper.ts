import { RackColumnConfiguration, RackZoneType } from '~/types/rackConfigurationTypes'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'

/**
 * Maps rack zone-based configurations to standard ColumnConfigurationType
 * for 3D visualization until rack-specific rendering is implemented.
 * 
 * This is a temporary bridge to make racks visible in the 3D viewer.
 */
export function mapRackConfigToColumnConfig(
  rackConfig: RackColumnConfiguration,
  columnWidth: number
): ColumnConfigurationType {
  const templateId = rackConfig.templateId
  
  // Map based on template ID for more accurate representation
  switch (templateId) {
    case 'OPEN_SHELVES_ONLY':
      // Open shelves = doors with shelves, single or split based on width
      return columnWidth <= 60 
        ? ColumnConfigurationType.DOOR_4_SHELVES 
        : ColumnConfigurationType.DOOR_SPLIT_4_SHELVES
    
    case 'SHELVES_WITH_FULL_DOOR':
      // Full door with shelves
      return columnWidth <= 60 
        ? ColumnConfigurationType.DOOR_5_SHELVES 
        : ColumnConfigurationType.DOOR_SPLIT_5_SHELVES
    
    case 'HALF_OPEN_HALF_CLOSED':
      // Mixed = some shelves visible
      return columnWidth <= 60 
        ? ColumnConfigurationType.DOOR_3_SHELVES 
        : ColumnConfigurationType.DOOR_SPLIT_3_SHELVES
    
    case 'DRAWERS_AND_SHELVES':
      // Drawers at bottom = use drawer configuration
      return ColumnConfigurationType.DRAWERS_3
    
    case 'MIXED_STORAGE':
      // Complex mix = drawers with some shelves
      return ColumnConfigurationType.DRAWERS_4
    
    default:
      // Fallback: analyze zones to determine best representation
      return inferConfigFromZones(rackConfig, columnWidth)
  }
}

/**
 * Infer appropriate column configuration by analyzing zones
 */
function inferConfigFromZones(
  config: RackColumnConfiguration,
  columnWidth: number
): ColumnConfigurationType {
  const hasDrawers = config.zones.some(z => z.type === RackZoneType.DRAWERS)
  
  // Count shelf zones (with or without doors)
  const shelfCount = config.zones.filter(z => 
    z.type === RackZoneType.SHELVES || 
    z.type === RackZoneType.SHELVES_FIXED
  ).length
  
  // If has drawers, use drawer configuration
  if (hasDrawers) {
    const drawerZone = config.zones.find(z => z.type === RackZoneType.DRAWERS)
    const drawerCount = drawerZone?.drawerCount || 3
    
    if (drawerCount >= 5) return ColumnConfigurationType.DRAWERS_5
    if (drawerCount >= 4) return ColumnConfigurationType.DRAWERS_4
    if (drawerCount >= 3) return ColumnConfigurationType.DRAWERS_3
    if (drawerCount >= 2) return ColumnConfigurationType.DRAWERS_2
    return ColumnConfigurationType.DRAWERS_1
  }
  
  // Otherwise use door/shelf configuration
  const isSplit = columnWidth > 60
  
  if (shelfCount >= 5) {
    return isSplit 
      ? ColumnConfigurationType.DOOR_SPLIT_5_SHELVES 
      : ColumnConfigurationType.DOOR_5_SHELVES
  }
  if (shelfCount >= 4) {
    return isSplit 
      ? ColumnConfigurationType.DOOR_SPLIT_4_SHELVES 
      : ColumnConfigurationType.DOOR_4_SHELVES
  }
  if (shelfCount >= 3) {
    return isSplit 
      ? ColumnConfigurationType.DOOR_SPLIT_3_SHELVES 
      : ColumnConfigurationType.DOOR_3_SHELVES
  }
  
  // Default fallback
  return isSplit 
    ? ColumnConfigurationType.DOOR_SPLIT_3_SHELVES 
    : ColumnConfigurationType.DOOR_3_SHELVES
}

