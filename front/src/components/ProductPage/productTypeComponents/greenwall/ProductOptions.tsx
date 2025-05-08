import React, { FC } from 'react'
import { ButtonOptionsType, ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
export type ProductOptionsComponent = {
  type: 'options',
  selectedFixationMethod: string,
  setSelectedFixationMethod: (value: string) => void,
  selectedStandOption: string,
  setSelectedStandOption: (value: string) => void
}
interface ProductOptionsProps {
  configuration: ProductOptionsComponent
}
export const fixationOptions: ButtonOptionsType[] = [
  { value: 'wall', label: 'perete' },
  { value: 'ceiling', label: 'tavan' },
]
export const addStandOptions: ButtonOptionsType[] = [
  { value: 'stand', label: 'da' },
  { value: 'noStand', label: 'nu' },
]
export const ProductOptions: FC<ProductOptionsProps> = (
  { configuration: {
    setSelectedFixationMethod,
    setSelectedStandOption
  } }
) => {
  return (
    <div>
      <p className={styles.furnitureTitle}>Opțiuni</p>
      
      <label className={styles.furnitureLabel}>
        <p>Tip fixare</p>
        <ButtonSelect
          options={fixationOptions}
          defaultSelected={'wall'}
          onChange={(value) => {
            setSelectedFixationMethod(value)
          }}
        />
      </label>
      <label className={styles.furnitureLabel}>
        <p>Sistem de irigare integrat</p>
        <ButtonSelect
          options={addStandOptions}
          defaultSelected={'noStand'}
          onChange={(value) => {
            setSelectedStandOption(value)
          }}
        />
      </label>
    </div>
  )
}
