import React, { FC } from 'react'
import { ButtonOptionsType, ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
export type ProductOptionsComponent = {
  type: 'options',
  selectedPCstandOption: string,
  setSelectedPCstandOption: (value: string) => void,
  selectedPartitionOption: string,
  setSelectedPartitionOption: (value: string) => void
}
interface ProductOptionsProps {
  configuration: ProductOptionsComponent
}
export const PCstandOptions: ButtonOptionsType[] = [
  { value: 'PC', label: 'da' },
  { value: 'noPC', label: 'nu' },
]
export const partitionOptions: ButtonOptionsType[] = [
  { value: 'partition', label: 'da' },
  { value: 'noPartition', label: 'nu' },
]
export const ProductOptions: FC<ProductOptionsProps> = (
  { configuration: {
    setSelectedPCstandOption,
    setSelectedPartitionOption
  } }
) => {
  return (
    <div>
      <p className={styles.furnitureTitle}>Opțiuni</p>
      
      <label className={styles.furnitureLabel}>
        <p>Sistem de susținere carcasă PC</p>
        <ButtonSelect
          options={PCstandOptions}
          defaultSelected={'noPC'}
          onChange={(value) => {
            setSelectedPCstandOption(value)
          }}
        />
      </label>
      <label className={styles.furnitureLabel}>
        <p>Panou despărțitor integrat</p>
        <ButtonSelect
          options={partitionOptions}
          defaultSelected={'noPartition'}
          onChange={(value) => {
            setSelectedPartitionOption(value)
          }}
        />
      </label>
    </div>
  )
}
