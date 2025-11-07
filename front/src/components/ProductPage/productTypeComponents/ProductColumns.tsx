import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'

export type ProductColumnsComponent = {
  type: 'columns'
  selectedColumns: number
  setSelectedColumns: (value: number) => void
  options?: ButtonOptionsType[]
}

interface ProductColumnsProps {
  configuration: ProductColumnsComponent
  predefinedValue?: number
  options?: ButtonOptionsType[]
}

export const columnsOptions: ButtonOptionsType[] = [
  { value: '1', label: 1 },
  { value: '2', label: 2 },
  { value: '3', label: 3 },
  { value: '4', label: 4 },
]

export const ProductColumns: FC<ProductColumnsProps> = ({
  configuration,
  predefinedValue,
  options: propOptions,
}) => {
  // Use options from configuration if available, otherwise from props, otherwise default
  const options = configuration.options ?? propOptions ?? columnsOptions
  return (
    <>
      <p className={styles.sectionsTitle}>
        <FormattedMessage
          id="homepage.configurator.options.title"
          defaultMessage="Opțiuni"
        />
      </p>
      <div>
        <label className={styles.furnitureLabel}>
          <p>
            <FormattedMessage
              id="homepage.configurator.columns.title"
              defaultMessage="Numărul de coloane"
            />
          </p>
          {predefinedValue != null ? (
            predefinedValue
          ) : (
            <ButtonSelect
              options={options}
              defaultSelected={configuration.selectedColumns.toString()}
              onChange={(value) => {
                // ignore clicks on disabled options (for future constraints)
                const opt = options.find((o) => o.value === value)
                if (!opt?.disabled) {
                  configuration.setSelectedColumns(parseInt(value))
                }
              }}
            />
          )}
        </label>
      </div>
    </>
  )
}
