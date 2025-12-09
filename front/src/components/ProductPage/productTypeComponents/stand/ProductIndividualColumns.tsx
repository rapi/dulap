import React, { FC, useMemo, useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useMediaQuery } from '@mui/material'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import { ButtonImageSelect } from '~/components/ButtonImageSelect/ButtonImageSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import {
  ColumnConfigurationType,
  getConfigurationMetadata,
  getDrawerCount,
  hasDrawers,
} from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { ColumnConfigurationIcon } from './ColumnConfigurationIcons'
import { DoorOpeningSideSelector } from './DoorOpeningSideSelector'
import {
  useColumnConfigurationConstraints,
  FurnitureProductType,
} from '~/hooks/useColumnConfigurationConstraints'
import { useActiveColumnTab } from '~/hooks/useActiveColumnTab'
import { useColumnConfigurationSync } from '~/hooks/useColumnConfigurationSync'
import { synchronizeDrawerCounts, getDefaultDoorOpeningSide } from '~/utils/columnConfigurationUtils'

export type ProductIndividualColumnsComponent = {
  type: 'individualColumns'
  selectedColumns: number
  columnConfigurations: ColumnConfigurationWithOptions[]
  setColumnConfigurations: (
    configurations:
      | ColumnConfigurationWithOptions[]
      | ((
          prev: ColumnConfigurationWithOptions[]
        ) => ColumnConfigurationWithOptions[])
  ) => void
  // Column dimensions for constraint evaluation
  columnWidth: number
  columnHeight: number
  columnDepth: number
  // Product type for product-specific filtering (e.g., TV stands don't have split doors)
  productType?: FurnitureProductType
}

interface ProductIndividualColumnsProps {
  configuration: ProductIndividualColumnsComponent
  activeTab?: number
  onActiveTabChange?: (index: number) => void
  onActiveColumnChange?: (index: number) => void // Called when active column changes (for 3D sync)
}

/**
 * Component for configuring individual columns
 * Allows user to select configuration type and door opening side for each column
 */
export const ProductIndividualColumns: FC<ProductIndividualColumnsProps> = ({
  configuration,
  activeTab: externalActiveTab,
  onActiveTabChange,
  onActiveColumnChange,
}) => {
  const {
    selectedColumns,
    columnConfigurations,
    setColumnConfigurations,
    columnWidth,
    columnHeight,
    columnDepth,
    productType,
  } = configuration

  const isMobile = useMediaQuery('(max-width: 768px)')

  // Manage active tab state
  const { activeTab, setActiveTab, currentColumnIndex } = useActiveColumnTab(
    externalActiveTab,
    onActiveTabChange,
    selectedColumns
  )

  // Notify parent when active column changes (for 3D sync)
  useEffect(() => {
    if (onActiveColumnChange) {
      onActiveColumnChange(currentColumnIndex)
    }
  }, [currentColumnIndex, onActiveColumnChange])

  // Get valid configurations based on current dimensions and product type
  const { allConfigurations, isValid } = useColumnConfigurationConstraints(
    columnWidth,
    columnHeight,
    columnDepth,
    productType
  )

  // Auto-sync configurations when dimensions change
  useColumnConfigurationSync(
    columnConfigurations,
    setColumnConfigurations,
    columnWidth,
    columnHeight,
    columnDepth,
    isValid
  )

  // Handle column type change with drawer count synchronization
  const handleColumnTypeChange = useCallback(
    (columnIndex: number, value: ColumnConfigurationType) => {
      setColumnConfigurations((prev) => {
        const metadata = getConfigurationMetadata(value)
        
        // Use user's explicit choice, or position-based default
        const defaultSide = getDefaultDoorOpeningSide(columnIndex, selectedColumns)
        const doorOpeningSide = metadata.doorCount === 1 
          ? (prev[columnIndex]?.doorOpeningSide || defaultSide)
          : undefined

        let newConfigurations = [...prev]
        newConfigurations[columnIndex] = { type: value, doorOpeningSide }

        // Auto-sync drawer counts: synchronize all columns with drawers to match the selected drawer count
        if (hasDrawers(value)) {
          const newDrawerCount = getDrawerCount(value)
          newConfigurations = synchronizeDrawerCounts(newConfigurations, columnIndex, newDrawerCount, isValid)
        }

        return newConfigurations
      })
    },
    [setColumnConfigurations, isValid, selectedColumns]
  )

  // Handle door opening side change
  const handleDoorOpeningSideChange = useCallback(
    (columnIndex: number, side: 'left' | 'right') => {
      setColumnConfigurations((prev) => {
        const newConfigurations = [...prev]
        const currentConfig = newConfigurations[columnIndex]

        // Ensure we have a valid configuration with a type
        if (!currentConfig || !currentConfig.type) {
          return prev
        }

        // Only update doorOpeningSide, preserve the type
        newConfigurations[columnIndex] = {
          type: currentConfig.type,
          doorOpeningSide: side,
        }
        
        return newConfigurations
      })
    },
    [setColumnConfigurations]
  )

  // Get available configuration options (only valid ones)
  const configurationOptions = useMemo(() => {
    return allConfigurations
      .filter((configType) => isValid(configType))
      .map((configType) => ({
        type: configType,
        metadata: getConfigurationMetadata(configType),
      }))
  }, [allConfigurations, isValid])

  // Column tab options for multi-column selection
  const columnTabOptions: ButtonOptionsType[] = useMemo(
    () =>
      Array.from({ length: selectedColumns }).map((_, index) => ({
        value: String(index),
        label: (
          <FormattedMessage
            id="homepage.configurator.individualColumns.column"
            values={{ number: index + 1 }}
          />
        ),
      })),
    [selectedColumns]
  )

  // Map configuration options to ButtonImageSelect options
  const imageSelectOptions = useMemo(
    () =>
      configurationOptions.map((option) => ({
        value: option.type,
        content: (
          <ColumnConfigurationIcon type={option.type} width={50} height={65} />
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

  // Current column configuration
  const currentConfig = columnConfigurations[currentColumnIndex]
  const currentValue = currentConfig?.type

  return (
    <div className={styles.individualColumnsLabel}>
      {!isMobile && (
        <p className={styles.sectionTitle} style={{ margin: '0' }}>
          <FormattedMessage
            id="homepage.configurator.individualColumns.title"
            defaultMessage="Configure individual sections"
          />
        </p>
      )}

      <div className={styles.furnitureConfig}>
        {/* Column tabs (only show if multiple columns) */}
        {selectedColumns > 1 && (
          <div className={styles.furnitureLabel}>
            <ButtonSelect options={columnTabOptions} defaultSelected={String(activeTab)} onChange={(value) => setActiveTab(parseInt(value))} />
          </div>
        )}

        {/* Configuration type selector */}
        <div className={styles.furnitureLabel}>
          <ButtonImageSelect<ColumnConfigurationType>
            ariaLabel="Column configuration"
            options={imageSelectOptions}
            value={currentValue}
            onChange={(v) => handleColumnTypeChange(currentColumnIndex, v)}
          />
        </div>

        {/* Door opening side selector (only for single door configurations) */}
        {currentConfig && (
          <DoorOpeningSideSelector
            columnIndex={currentColumnIndex}
            totalColumns={selectedColumns}
            config={currentConfig}
            onDoorOpeningSideChange={handleDoorOpeningSideChange}
          />
        )}
      </div>
    </div>
  )
}
