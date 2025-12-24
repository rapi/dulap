import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import { ColumnConfigurationType } from './columnConfigurationTypes'
import { WardrobeColumnConfiguration } from './wardrobeConfigurationTypes'
import { RackColumnConfiguration } from './rackConfigurationTypes'

/**
 * Extended column configuration that includes type and door opening side
 * This is used internally and can be passed as extended config
 */
export interface ColumnConfigurationWithOptions {
  type: ColumnConfigurationType
  doorOpeningSide?: 'left' | 'right' // Only for single door configurations
}

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
 * columnConfigurations can be:
 * - ColumnConfigurationType[] (for stand/bedside/tv-stand)
 * - WardrobeColumnConfiguration[] (for wardrobe)
 * - RackColumnConfiguration[] (for rack)
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
  columnConfigurations?:
    | ColumnConfigurationType[]
    | WardrobeColumnConfiguration[]
    | RackColumnConfiguration[]
  columnConfigurationsWithOptions?: ColumnConfigurationWithOptions[] // Extended config with door opening side (for stand)
  columnWidths?: number[] // Optional: variable column widths (for wardrobe/rack)
  columnPositions?: number[] // Optional: custom column X positions (for wardrobe/rack)
  furnitureType?:
    | 'wardrobe'
    | 'stand'
    | 'tv-stand'
    | 'bedside'
    | 'office-table'
    | 'greenwall'
    | 'storage'
    | 'rack'
    | 'shoe-rack'
  selectedColumnIndex?: number | null // Optional: externally controlled selected column index
  onColumnClick?: (index: number | null) => void // Callback when a column is clicked in 3D (null = deselect)
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
