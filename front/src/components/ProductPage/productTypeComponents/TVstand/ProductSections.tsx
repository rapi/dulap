import React, { FC, useEffect } from 'react'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
export type ProductSectionsComponent = {
  type: 'sections'
  selectedSections: number
  setSelectedSections: (value: number) => void
  possibleSectionsList: string[]
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
      disabled: !configuration.possibleSectionsList.includes(section.value),
    }))
    useEffect(() => {
    const current = String(configuration.selectedSections)
    if (!configuration.possibleSectionsList.includes(current) && configuration.possibleSectionsList.length) {
      const allowedNums = configuration.possibleSectionsList.map((s) => parseInt(s, 10))
      const closest = allowedNums.reduce((prev, curr) => {
        return Math.abs(curr - configuration.selectedSections) < Math.abs(prev - configuration.selectedSections)
          ? curr
          : prev
      }, allowedNums[0])

      configuration.setSelectedSections(closest)
    }
  }, [configuration.possibleSectionsList, configuration.selectedSections, configuration.setSelectedSections])
  return (
    <div>
      <p className={styles.sectionsTitle}>Opțiuni</p>

      <label className={styles.furnitureLabel}>
        <p>Secțiuni</p>
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
