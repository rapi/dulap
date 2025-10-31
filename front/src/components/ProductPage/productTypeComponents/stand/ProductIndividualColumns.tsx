import React, { FC, useState, useMemo, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { ColumnConfigurationIcon } from './ColumnConfigurationIcons'
import { useColumnConfigurationConstraints } from '~/hooks/useColumnConfigurationConstraints'
import { findNearestAvailableConfiguration } from '~/utils/columnConfigurationFallback'

export type ProductIndividualColumnsComponent = {
  type: 'individualColumns'
  selectedColumns: number
  columnConfigurations: ColumnConfigurationType[]
  setColumnConfigurations: (configurations: ColumnConfigurationType[]) => void
  // Column dimensions for constraint evaluation
  columnWidth: number
  columnHeight: number
  columnDepth: number
}

interface ProductIndividualColumnsProps {
  configuration: ProductIndividualColumnsComponent
}

export const ProductIndividualColumns: FC<ProductIndividualColumnsProps> = ({
  configuration,
}) => {
  const { 
    selectedColumns, 
    columnConfigurations, 
    setColumnConfigurations,
    columnWidth,
    columnHeight,
    columnDepth,
  } = configuration
  const [activeTab, setActiveTab] = useState(0)

  // Reset active tab to first column when it becomes out of bounds
  useEffect(() => {
    if (activeTab >= selectedColumns) {
      setActiveTab(0)
    }
  }, [selectedColumns, activeTab])

  // Get constraint evaluation
  const { allConfigurations, isValid } = useColumnConfigurationConstraints(
    columnWidth,
    columnHeight,
    columnDepth
  )

  // Automatically switch to nearest available configuration when current becomes invalid
  useEffect(() => {
    const dimensions = { width: columnWidth, height: columnHeight, depth: columnDepth }
    const updatedConfigurations = columnConfigurations.map(config => {
      if (!isValid(config)) {
        const nearestConfig = findNearestAvailableConfiguration(config, dimensions)
        return nearestConfig || config // Keep original if no valid alternative (shouldn't happen)
      }
      return config
    })

    // Only update if there were changes
    const hasChanges = updatedConfigurations.some(
      (config, index) => config !== columnConfigurations[index]
    )
    
    if (hasChanges) {
      setColumnConfigurations(updatedConfigurations)
    }
  }, [columnWidth, columnHeight, columnDepth, isValid]) // Note: not including columnConfigurations to avoid infinite loop

  const handleColumnTypeChange = (columnIndex: number, value: ColumnConfigurationType) => {
    const newConfigurations = [...columnConfigurations]
    newConfigurations[columnIndex] = value
    setColumnConfigurations(newConfigurations)
  }

  // Get configuration options with metadata - filter out invalid ones
  const configurationOptions = useMemo(() => {
    return allConfigurations
      .filter(configType => isValid(configType)) // Only show valid configurations
      .map(configType => ({
        type: configType,
        metadata: getConfigurationMetadata(configType),
      }))
  }, [allConfigurations, isValid])

  const columnTabOptions: ButtonOptionsType[] = Array.from({ length: selectedColumns }).map((_, index) => ({
    value: String(index),
    label: (
      <FormattedMessage
        id="homepage.configurator.individualColumns.column"
        values={{ number: index + 1 }}
      />
    ),
  }))

  return (
    <div>
      <p className={styles.sectionTitle}>
        <FormattedMessage
          id="homepage.configurator.individualColumns.title"
          defaultMessage="Configure individual sections"
        />
      </p>

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
        <div className={styles.columnConfigScrollContainer}>
          <div className={styles.columnConfigRow}>
            {configurationOptions.map((option) => {
              // Ensure we use a valid column index even if activeTab is temporarily out of bounds
              const safeActiveTab = activeTab >= selectedColumns ? 0 : activeTab
              const currentColumnIndex = selectedColumns === 1 ? 0 : safeActiveTab
              const isSelected = columnConfigurations[currentColumnIndex] === option.type

              return (
                <div
                  key={option.type}
                  className={`${styles.columnConfigOption} ${
                    isSelected ? styles.columnConfigSelected : ''
                  }`}
                  onClick={() => handleColumnTypeChange(currentColumnIndex, option.type)}
                  title={option.metadata.description}
                >
                  <div className={styles.columnConfigIcon}>
                    <ColumnConfigurationIcon type={option.type} width={60} height={75} />
                  </div>
                  <div className={styles.columnConfigLabel}>
                    <FormattedMessage 
                      id={option.metadata.label}
                      defaultMessage={option.metadata.description}
                    />
                  </div>
                  {isSelected && (
                    <div className={styles.columnConfigCheckmark}>✓</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </label>
    </div>
  )
}

