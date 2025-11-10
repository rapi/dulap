import { useEffect } from 'react'
import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { findNearestAvailableConfiguration } from '~/utils/columnConfigurationFallback'

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

    // Only validate and update if configurations exist and have types
    const updatedConfigurations = columnConfigurations.map((config) => {
      // Skip if config is missing or doesn't have a type
      if (!config || !config.type) {
        return config
      }

      if (!isValid(config.type)) {
        const nearestType = findNearestAvailableConfiguration(config.type, dimensions)
        if (nearestType && nearestType !== config.type) {
          const metadata = getConfigurationMetadata(nearestType)
          const doorOpeningSide = metadata.doorCount === 1 ? config.doorOpeningSide || 'left' : undefined
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

