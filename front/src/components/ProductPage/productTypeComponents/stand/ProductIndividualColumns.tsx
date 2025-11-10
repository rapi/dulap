import React, { FC, useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import {
  ColumnConfigurationType,
  getConfigurationMetadata,
} from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { ColumnConfigurationIcon } from './ColumnConfigurationIcons'
import { useColumnConfigurationConstraints } from '~/hooks/useColumnConfigurationConstraints'
import { findNearestAvailableConfiguration } from '~/utils/columnConfigurationFallback'
import { ButtonImageSelect } from '~/components/ButtonImageSelect/ButtonImageSelect'
import { useMediaQuery } from '@mui/material'

export type ProductIndividualColumnsComponent = {
  type: 'individualColumns'
  selectedColumns: number
  columnConfigurations: ColumnConfigurationWithOptions[]
  setColumnConfigurations: (configurations: ColumnConfigurationWithOptions[] | ((prev: ColumnConfigurationWithOptions[]) => ColumnConfigurationWithOptions[])) => void
  // Column dimensions for constraint evaluation
  columnWidth: number
  columnHeight: number
  columnDepth: number
}

interface ProductIndividualColumnsProps {
  configuration: ProductIndividualColumnsComponent
  activeTab?: number
  onActiveTabChange?: (index: number) => void
  onColumnDeselect?: () => void // Callback to deselect column in 3D viewer
}

export const ProductIndividualColumns: FC<ProductIndividualColumnsProps> = ({
  configuration,
  activeTab: externalActiveTab,
  onActiveTabChange,
  onColumnDeselect,
}) => {
  const {
    selectedColumns,
    columnConfigurations,
    setColumnConfigurations,
    columnWidth,
    columnHeight,
    columnDepth,
  } = configuration
  const [internalActiveTab, setInternalActiveTab] = useState(0)

  // Use external activeTab if provided, otherwise use internal state
  const activeTab =
    externalActiveTab !== undefined ? externalActiveTab : internalActiveTab
  const setActiveTab = onActiveTabChange || setInternalActiveTab

  // Reset active tab to first column when it becomes out of bounds
  useEffect(() => {
    if (activeTab >= selectedColumns) {
      setActiveTab(0)
    }
  }, [selectedColumns, activeTab, setActiveTab])

  // Sync internal state when external activeTab changes
  useEffect(() => {
    if (
      externalActiveTab !== undefined &&
      externalActiveTab !== internalActiveTab
    ) {
      setInternalActiveTab(externalActiveTab)
    }
  }, [externalActiveTab, internalActiveTab])

  // Track previous configuration for active column to detect changes
  const prevActiveColumnConfigRef = useRef<ColumnConfigurationType | undefined>(
    undefined
  )
  const prevActiveTabRef = useRef<number>(activeTab)

  // Deselect column in 3D viewer when active column's configuration changes
  useEffect(() => {
    const safeActiveTab = activeTab >= selectedColumns ? 0 : activeTab
    const currentColumnIndex = selectedColumns === 1 ? 0 : safeActiveTab
    const currentConfig = columnConfigurations[currentColumnIndex]?.type

    // Reset tracking when switching to a different column
    if (prevActiveTabRef.current !== safeActiveTab) {
      prevActiveColumnConfigRef.current = currentConfig
      prevActiveTabRef.current = safeActiveTab
      return
    }

    // If the configuration changed for the same column and we have a callback, deselect the column
    if (
      prevActiveColumnConfigRef.current !== undefined &&
      prevActiveColumnConfigRef.current !== currentConfig &&
      onColumnDeselect
    ) {
      onColumnDeselect()
    }

    // Update the refs for next comparison
    prevActiveColumnConfigRef.current = currentConfig
    prevActiveTabRef.current = safeActiveTab
  }, [activeTab, selectedColumns, columnConfigurations, onColumnDeselect])

  // Get constraint evaluation
  const { allConfigurations, isValid } = useColumnConfigurationConstraints(
    columnWidth,
    columnHeight,
    columnDepth
  )

  // Automatically switch to nearest available configuration when current becomes invalid
  useEffect(() => {
    // Use a ref to track if we're in the middle of an update to prevent infinite loops
    const dimensions = { width: columnWidth, height: columnHeight, depth: columnDepth }
    
    // Only validate and update if configurations exist and have types
    const updatedConfigurations = columnConfigurations.map(config => {
      // Skip if config is missing or doesn't have a type
      if (!config || !config.type) {
        return config
      }
      
      if (!isValid(config.type)) {
        const nearestType = findNearestAvailableConfiguration(config.type, dimensions)
        if (nearestType && nearestType !== config.type) {
          const metadata = getConfigurationMetadata(nearestType)
          const doorOpeningSide = metadata.doorCount === 1 
            ? (config.doorOpeningSide || 'left')
            : undefined
          return { type: nearestType, doorOpeningSide }
        }
      }
      return config
    })

    // Only update if there were actual type changes (not just doorOpeningSide changes)
    const hasTypeChanges = updatedConfigurations.some(
      (config, index) => {
        const currentConfig = columnConfigurations[index]
        return currentConfig && config.type !== currentConfig.type
      }
    )

    if (hasTypeChanges) {
      setColumnConfigurations(updatedConfigurations)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnWidth, columnHeight, columnDepth, isValid]) // Note: not including columnConfigurations to avoid infinite loop

  const handleColumnTypeChange = (columnIndex: number, value: ColumnConfigurationType) => {
    const newConfigurations = [...columnConfigurations]
    const metadata = getConfigurationMetadata(value)
    const doorOpeningSide = metadata.doorCount === 1 
      ? (newConfigurations[columnIndex]?.doorOpeningSide || 'left')
      : undefined
    newConfigurations[columnIndex] = { type: value, doorOpeningSide }
    setColumnConfigurations(newConfigurations)
  }

  const handleDoorOpeningSideChange = useCallback((columnIndex: number, side: 'left' | 'right') => {
    setColumnConfigurations((prev) => {
      const newConfigurations = [...prev]
      const currentConfig = newConfigurations[columnIndex]
      
      // Ensure we have a valid configuration with a type
      if (!currentConfig || !currentConfig.type) {
        console.warn('Cannot update door opening side: configuration missing type', { columnIndex, currentConfig })
        return prev
      }
      
      // Only update doorOpeningSide, preserve the type
      newConfigurations[columnIndex] = {
        type: currentConfig.type,
        doorOpeningSide: side
      }
      return newConfigurations
    })
  }, [setColumnConfigurations])

  // Get configuration options with metadata - filter out invalid ones
  const configurationOptions = useMemo(() => {
    return allConfigurations
      .filter((configType) => isValid(configType)) // Only show valid configurations
      .map((configType) => ({
        type: configType,
        metadata: getConfigurationMetadata(configType),
      }))
  }, [allConfigurations, isValid])

  // Memoize door opening side options
  const doorOpeningSideOptions: ButtonOptionsType<'left' | 'right'>[] = useMemo(() => [
    { value: 'left' as const, label: 'homepage.configurator.individualColumns.doorOpeningSide.left' },
    { value: 'right' as const, label: 'homepage.configurator.individualColumns.doorOpeningSide.right' },
  ], [])

  const columnTabOptions: ButtonOptionsType[] = Array.from({
    length: selectedColumns,
  }).map((_, index) => ({
    value: String(index),
    label: (
      <FormattedMessage
        id="homepage.configurator.individualColumns.column"
        values={{ number: index + 1 }}
      />
    ),
  }))

  // Map configuration options to ButtonImageSelect options
  const imageSelectOptions = useMemo(
    () =>
      configurationOptions.map((option) => ({
        value: option.type,
        content: (
          <ColumnConfigurationIcon type={option.type} width={60} height={75} />
        ),
        label: (
          <FormattedMessage
            id={option.metadata.label}
            defaultMessage={option.metadata.description}
          />
        ),
        title: option.metadata.description,
      })),
    [configurationOptions]
  )

  // Ensure we use a valid column index even if activeTab is temporarily out of bounds
  const safeActiveTab = activeTab >= selectedColumns ? 0 : activeTab
  const currentColumnIndex = selectedColumns === 1 ? 0 : safeActiveTab
  const currentConfig = columnConfigurations[currentColumnIndex]
  const currentValue = currentConfig?.type

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <label className={styles.individualColumnsLabel}>
      {!isMobile && (
        <p className={styles.sectionTitle}>
          <FormattedMessage
            id="homepage.configurator.individualColumns.title"
            defaultMessage="Configure individual sections"
          />
        </p>
      )}
      <div className={styles.furnitureConfig}>
        {selectedColumns > 1 && (
          <label className={styles.furnitureLabel}>
            <ButtonSelect
              options={columnTabOptions}
              defaultSelected={String(activeTab)}
              onChange={(value) => setActiveTab(parseInt(value))}
            />
          </label>
        )}

        <label className={styles.furnitureLabel}>
          <ButtonImageSelect<ColumnConfigurationType>
            ariaLabel="Column configuration"
            options={imageSelectOptions}
            value={currentValue}
            onChange={(v) => handleColumnTypeChange(currentColumnIndex, v)}
          />
        </label>

        {/* Door opening side toggle - only show for single door configurations */}
        {useMemo(() => {
          const safeActiveTab = activeTab >= selectedColumns ? 0 : activeTab
          const colIndex = selectedColumns === 1 ? 0 : safeActiveTab
          const config = columnConfigurations[colIndex]
          
          if (!config) return null
          
          const metadata = getConfigurationMetadata(config.type)
          const isSingleDoor = metadata?.doorCount === 1

          if (!isSingleDoor) return null
          
          const currentSide = config.doorOpeningSide || 'left'
          
          return (
            <label className={styles.furnitureLabel}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                  <FormattedMessage
                    id="homepage.configurator.individualColumns.doorOpeningSide"
                    defaultMessage="Door opening side"
                  />:
                </span>
                <ButtonSelect
                  key={`door-side-${colIndex}`}
                  options={doorOpeningSideOptions}
                  defaultSelected={currentSide}
                  onChange={(value) => handleDoorOpeningSideChange(colIndex, value as 'left' | 'right')}
                />
              </div>
            </label>
          )
        }, [activeTab, selectedColumns, columnConfigurations, doorOpeningSideOptions, handleDoorOpeningSideChange])}
      </div>
    </label>
  )
}
