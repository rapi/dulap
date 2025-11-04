import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import { ColumnConfigurationType } from './columnConfigurationTypes'

/**
 * Default configuration for a furniture product
 */
export interface FurnitureDefaults {
  width: number
  height: number
  depth: number
  plintHeight: number
  selectedColor: string
  columns?: number
  sections?: number
}

/**
 * Props required for 3D furniture rendering
 */
export interface Furniture3DProps {
  selectedColor: string
  width: number
  height: number
  depth: number
  currentPlintHeight: number
  sections: number
  openingType: OpeningType
  columns: number
  columnConfigurations?: ColumnConfigurationType[]
  columnWidths?: number[] // Optional: variable column widths (for wardrobe)
  columnPositions?: number[] // Optional: custom column X positions (for wardrobe)
  furnitureType?: 'wardrobe' | 'stand' | 'tv-stand' | 'bedside' | 'office-table' | 'greenwall' | 'storage'
  onColumnClick?: (index: number) => void // Callback when a column is clicked in 3D
  onDeselectFunctionReady?: (deselectFn: () => void) => void // Called with the deselection function that parent can store and call
}

/**
 * Configuration extracted from product components
 */
export interface ProductComponentData {
  currentComponents: any[] // eslint-disable-line @typescript-eslint/no-explicit-any -- Type depends on product
  values?: any // eslint-disable-line @typescript-eslint/no-explicit-any -- Predefined values
  defaults: FurnitureDefaults
}

