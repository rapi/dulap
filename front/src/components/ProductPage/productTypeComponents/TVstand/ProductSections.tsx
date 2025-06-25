import React, { FC, useEffect } from 'react'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
export type ProductSectionsComponent = {
  type: 'sections'
  selectedSections: number
  setSelectedSections: (value: number) => void
  activeSections: string[]
}
interface ProductSectionsProps {
  configuration: ProductSectionsComponent
  predefinedValue?: number
}

export const ProductSections: FC<ProductSectionsProps> = ({
  configuration,
}) => {
  const sections = new Array(4).fill(0).map((_, i) => ({
    value: String(i + 1),
    label: `homepage.configurator.sections.nr.${String(i + 1)}`,
  }))
  const possibleSections: ButtonOptionsType[] = sections.map((section) => ({
      label: section.label,
      value: section.value,
      disabled: !configuration.activeSections.includes(section.value),
    }))
    useEffect(() => {
    const current = String(configuration.selectedSections)
    if (!configuration.activeSections.includes(current) && configuration.activeSections.length) {
      const allowedNums = configuration.activeSections.map((s) => parseInt(s, 10))
      const closest = allowedNums.reduce((prev, curr) => {
        return Math.abs(curr - configuration.selectedSections) < Math.abs(prev - configuration.selectedSections)
          ? curr
          : prev
      }, allowedNums[0])

      configuration.setSelectedSections(closest)
    }
  }, [configuration.activeSections, configuration.selectedSections, configuration.setSelectedSections])
  return (
    <div>
      <p className={styles.sectionsTitle}><FormattedMessage id="homepage.configurator.options.title" defaultMessage="Opțiuni" /></p>

      <label className={styles.furnitureLabel}>
        <p><FormattedMessage id="homepage.configurator.sections.title" defaultMessage="Secțiuni" /></p>
        <ButtonSelect
          options={possibleSections}
          defaultSelected={configuration.selectedSections.toString()}
          onChange={(value) => {
            configuration.setSelectedSections(parseInt(value))
          }}
        />
      </label>
    </div>
  )
}
