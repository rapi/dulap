import { useMemo } from 'react'
import { Furniture3DProps, FurnitureDefaults, ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { getColorItemByName } from '~/utils/colorDictionary'
import { convertToOpeningType } from '~/utils/openingTypeConverter'
import { calculateWardrobeColumnLayout } from '~/utils/wardrobeColumnLayout'
import { calculateRackColumnLayout } from '~/utils/rackColumnLayout'
import { RackColumnConfiguration } from '~/types/rackConfigurationTypes'

/**
 * Custom hook to extract and compute 3D furniture props from product components
 * Eliminates code duplication across BedsideProductPage, TVStandProductPage, and StandProductPage
 * 
 * @param currentComponents - Array of product components (dimensions, colors, sections, etc.)
 * @param values - Optional predefined values from URL or configuration
 * @param defaults - Default values for the product type
 * @param isWardrobe - Whether this is a wardrobe (uses automatic column layout)
 * @param furnitureType - The type of furniture (wardrobe, stand, tv-stand, etc.)
 * @returns Computed props for FurnitureViewer component
 */
export function use3DFurnitureProps(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentComponents: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any = {},
  defaults: FurnitureDefaults,
  isWardrobe: boolean = false,
  furnitureType?: 'wardrobe' | 'stand' | 'tv-stand' | 'bedside' | 'office-table' | 'greenwall' | 'storage' | 'rack'
): Furniture3DProps {
  return useMemo(() => {
    // Extract color component and convert name to HEX
    const colorsComponent = currentComponents.find(
      (c) => c.type === 'colors'
    )
    const selectedColorNameOrHex =
      colorsComponent?.selectedColor ?? defaults.selectedColor
    const selectedColorHex =
      getColorItemByName(selectedColorNameOrHex)?.hexCode ??
      selectedColorNameOrHex

    // Extract dimensions component
    const dimensionsComponent = currentComponents.find(
      (c) => c.type === 'dimensions'
    )
    const width = dimensionsComponent?.width ?? defaults.width
    const height = dimensionsComponent?.height ?? defaults.height
    const depth = dimensionsComponent?.depth ?? defaults.depth
    const currentPlintHeight =
      dimensionsComponent?.plintHeight ?? defaults.plintHeight

    // Extract sections component
    const sectionsComponent = currentComponents.find(
      (c) => c.type === 'sections'
    )
    const sections =
      sectionsComponent?.selectedSections ??
      (typeof values?.sections === 'number' 
        ? values.sections 
        : defaults.sections ?? 1)

    // Extract columns component
    const columnsComponent = currentComponents.find(
      (c) => c.type === 'columns'
    )
    const columns =
      columnsComponent?.selectedColumns ??
      (typeof values?.columns === 'number' 
        ? values.columns 
        : defaults.columns ?? 1)

    // Extract opening type from furniture component
    const furnitureComponent = currentComponents.find(
      (c) => c.type === 'furniture'
    )
    const rawOpeningMethod =
      values?.furniture?.openingType ??
      furnitureComponent?.selectedOpeningMethod ??
      'push'
    const openingType = convertToOpeningType(rawOpeningMethod)

    // Extract column configurations
    const individualColumnsComponent = currentComponents.find(
      (c) => c.type === 'individualColumns'
    )
    const wardrobeColumnsComponent = currentComponents.find(
      (c) => c.type === 'wardrobeColumns'
    )
    const rackColumnsComponent = currentComponents.find(
      (c) => c.type === 'rackColumns'
    )
    const columnConfigs = wardrobeColumnsComponent?.columnConfigurations ?? rackColumnsComponent?.columnConfigurations ?? individualColumnsComponent?.columnConfigurations
    
    // Check if we have extended config (with doorOpeningSide) or simple config
    // Extended config is an array of objects with 'type' property (ColumnConfigurationWithOptions[])
    // Simple config is an array of ColumnConfigurationType enum values
    const hasExtendedConfig = columnConfigs && 
      columnConfigs.length > 0 && 
      typeof columnConfigs[0] === 'object' && 
      'type' in columnConfigs[0]
    
    // Extract column configuration types for backward compatibility
    const columnConfigurations = hasExtendedConfig 
      ? (columnConfigs as ColumnConfigurationWithOptions[])?.map((config) => config.type)
      : (columnConfigs as ColumnConfigurationType[] | undefined)
    
    // Extract extended config if available (for stand)
    // Create a new array with new objects to ensure reference changes when content changes
    const columnConfigurationsWithOptions = hasExtendedConfig 
      ? (columnConfigs as ColumnConfigurationWithOptions[]).map(config => ({ ...config }))
      : undefined

    // Extract metadata component (contains derivedSections for new 3D system)
    const metadataComponent = currentComponents.find(
      (c) => c.type === 'metadata'
    )
    // Use derivedSections if available (new 3D system), otherwise use sections (old system)
    const effectiveSections = metadataComponent?.derivedSections ?? sections

    // Calculate wardrobe or rack-specific column layout if applicable
    let wardrobeLayout
    let rackLayout
    if (isWardrobe) {
      if (furnitureType === 'rack') {
        rackLayout = calculateRackColumnLayout(width)
      } else {
        wardrobeLayout = calculateWardrobeColumnLayout(width)
      }
    }

    // For wardrobes/racks: use zone-based configs if available, otherwise use old string-based configs
    // wardrobeLayout/rackLayout.columnConfigurations is just for fallback/compatibility
    const layoutToUse = wardrobeLayout ?? rackLayout
    
    // For racks: pass rack configurations directly (they will be rendered by RackBuilder)
    // For wardrobes: pass wardrobe configurations directly
    // For others: use standard column configurations
    let finalColumnConfigurations
    if (furnitureType === 'rack' && columnConfigs) {
      // Pass rack configurations directly - RackBuilder will handle rendering
      finalColumnConfigurations = columnConfigs as RackColumnConfiguration[]
    } else if (furnitureType === 'wardrobe' && columnConfigs) {
      // Pass wardrobe configurations directly
      finalColumnConfigurations = columnConfigs
    } else {
      // Use standard column configurations
      finalColumnConfigurations = columnConfigs ?? layoutToUse?.columnConfigurations ?? columnConfigurations
    }

    return {
      selectedColor: selectedColorHex,
      width,
      height,
      depth,
      currentPlintHeight,
      sections: effectiveSections, // Use derived sections for new 3D, old sections for legacy
      openingType,
      columns: layoutToUse?.columnCount ?? columns,
      columnConfigurations: finalColumnConfigurations,
      columnConfigurationsWithOptions,
      columnWidths: layoutToUse?.columnWidths,
      columnPositions: layoutToUse?.columnPositions,
      furnitureType,
    }
  }, [currentComponents, values, defaults, isWardrobe, furnitureType])
}

