import React, { FC, useState, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { ColumnConfigurationIcon } from './ColumnConfigurationIcons'
import { useColumnConfigurationConstraints } from '~/hooks/useColumnConfigurationConstraints'

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

  // Get constraint evaluation
  const { allConfigurations, isValid } = useColumnConfigurationConstraints(
    columnWidth,
    columnHeight,
    columnDepth
  )

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
              const currentColumnIndex = selectedColumns === 1 ? 0 : activeTab
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

