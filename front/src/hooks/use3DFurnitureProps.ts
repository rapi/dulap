import { useMemo } from 'react'
import { Furniture3DProps, FurnitureDefaults, ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { getColorItemByName } from '~/utils/colorDictionary'
import { convertToOpeningType } from '~/utils/openingTypeConverter'
import { calculateWardrobeColumnLayout } from '~/utils/wardrobeColumnLayout'

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
  furnitureType?: 'wardrobe' | 'stand' | 'tv-stand' | 'bedside' | 'office-table' | 'greenwall' | 'storage'
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
    const columnConfigs = individualColumnsComponent?.columnConfigurations
    
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

    // Calculate wardrobe-specific column layout if applicable
    let wardrobeLayout
    if (isWardrobe) {
      wardrobeLayout = calculateWardrobeColumnLayout(width)
    }

    return {
      selectedColor: selectedColorHex,
      width,
      height,
      depth,
      currentPlintHeight,
      sections: effectiveSections, // Use derived sections for new 3D, old sections for legacy
      openingType,
      columns: wardrobeLayout?.columnCount ?? columns,
      columnConfigurations: wardrobeLayout?.columnConfigurations ?? columnConfigurations,
      columnConfigurationsWithOptions,
      columnWidths: wardrobeLayout?.columnWidths,
      columnPositions: wardrobeLayout?.columnPositions,
      furnitureType,
    }
  }, [currentComponents, values, defaults, isWardrobe, furnitureType])
}

