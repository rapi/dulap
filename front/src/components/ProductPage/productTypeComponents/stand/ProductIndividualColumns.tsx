import React, { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'

export type ColumnConfiguration = 'drawers' | 'door'

export type ProductIndividualColumnsComponent = {
  type: 'individualColumns'
  selectedColumns: number
  columnConfigurations: ColumnConfiguration[]
  setColumnConfigurations: (configurations: ColumnConfiguration[]) => void
}

interface ProductIndividualColumnsProps {
  configuration: ProductIndividualColumnsComponent
}

const columnTypeOptions: ButtonOptionsType<ColumnConfiguration>[] = [
  { value: 'drawers', label: 'homepage.configurator.individualColumns.drawers' },
  { value: 'door', label: 'homepage.configurator.individualColumns.door' },
]

export const ProductIndividualColumns: FC<ProductIndividualColumnsProps> = ({
  configuration,
}) => {
  const { selectedColumns, columnConfigurations, setColumnConfigurations } = configuration
  const [activeTab, setActiveTab] = useState(0)

  const handleColumnTypeChange = (columnIndex: number, value: ColumnConfiguration) => {
    const newConfigurations = [...columnConfigurations]
    newConfigurations[columnIndex] = value
    setColumnConfigurations(newConfigurations)
  }

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
        <div className={styles.columnTypeImages}>
              {columnTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.columnTypeImage} ${
                    columnConfigurations[selectedColumns === 1 ? 0 : activeTab] === option.value
                      ? styles.columnTypeImageSelected
                      : ''
                  }`}
                  onClick={() => handleColumnTypeChange(selectedColumns === 1 ? 0 : activeTab, option.value)}
                >
                  {/* Placeholder for images - we'll use SVG icons */}
                  <div className={styles.columnTypeIcon}>
                    {option.value === 'drawers' ? (
                      // Drawers icon
                      <svg width="60" height="70" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="10" width="80" height="100" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <line x1="10" y1="36.67" x2="90" y2="36.67" stroke="currentColor" strokeWidth="2"/>
                        <line x1="10" y1="63.33" x2="90" y2="63.33" stroke="currentColor" strokeWidth="2"/>
                        <line x1="45" y1="20" x2="55" y2="20" stroke="currentColor" strokeWidth="3"/>
                        <line x1="45" y1="47" x2="55" y2="47" stroke="currentColor" strokeWidth="3"/>
                        <line x1="45" y1="77" x2="55" y2="77" stroke="currentColor" strokeWidth="3"/>
                      </svg>
                    ) : (
                      // Door icon
                      <svg width="60" height="70" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="10" width="80" height="100" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <line x1="30" y1="15" x2="30" y2="105" stroke="currentColor" strokeWidth="1"/>
                        <circle cx="25" cy="60" r="3" fill="currentColor"/>
                      </svg>
                    )}
                  </div>
                  <div className={styles.columnTypeLabel}>
                    <FormattedMessage id={option.label as string} />
                  </div>
                  {columnConfigurations[selectedColumns === 1 ? 0 : activeTab] === option.value && (
                    <div className={styles.columnTypeCheckmark}>✓</div>
                  )}
                </div>
              ))}
        </div>
      </label>
    </div>
  )
}

