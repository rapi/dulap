import { useEffect } from 'react'
import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { findNearestAvailableConfiguration } from '~/utils/columnConfigurationFallback'
import { getDefaultDoorOpeningSide } from '~/utils/columnConfigurationUtils'

/**
 * Hook to automatically sync configurations when dimensions change
 * Updates invalid configurations to nearest valid alternative
 */
export function useColumnConfigurationSync(
  columnConfigurations: ColumnConfigurationWithOptions[],
  setColumnConfigurations: (configs: ColumnConfigurationWithOptions[]) => void,
  columnWidth: number,
  columnHeight: number,
  columnDepth: number,
  isValid: (type: ColumnConfigurationType) => boolean
) {
  useEffect(() => {
    const dimensions = { width: columnWidth, height: columnHeight, depth: columnDepth }
    const totalColumns = columnConfigurations.length

    // Only validate and update if configurations exist and have types
    const updatedConfigurations = columnConfigurations.map((config, columnIndex) => {
      // Skip if config is missing or doesn't have a type
      if (!config || !config.type) {
        return config
      }

      if (!isValid(config.type)) {
        // Get current drawer count to preserve it if possible
        const currentMetadata = getConfigurationMetadata(config.type)
        const currentDrawerCount = currentMetadata?.drawerCount
        
        const nearestType = findNearestAvailableConfiguration(config.type, dimensions, undefined, currentDrawerCount)
        if (nearestType && nearestType !== config.type) {
          const metadata = getConfigurationMetadata(nearestType)
          // Preserve user's choice, or use position-based default
          const defaultSide = getDefaultDoorOpeningSide(columnIndex, totalColumns)
          const doorOpeningSide = metadata.doorCount === 1 
            ? (config.doorOpeningSide || defaultSide)
            : undefined
          return { type: nearestType, doorOpeningSide }
        }
      }
      return config
    })

    // Only update if there were actual type changes (not just doorOpeningSide changes)
    const hasTypeChanges = updatedConfigurations.some((config, index) => {
      const currentConfig = columnConfigurations[index]
      return currentConfig && config.type !== currentConfig.type
    })

    if (hasTypeChanges) {
      setColumnConfigurations(updatedConfigurations)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnWidth, columnHeight, columnDepth, isValid]) // Note: not including columnConfigurations to avoid infinite loop
}

