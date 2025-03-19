import React, { FC } from 'react'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import FormControl from '@mui/material/FormControl'
import { openingOptions } from '~/components/ProductWardrobe/ProductWardrobe'
import styles from './ProductFurniture.module.css'
import Select from '~/components/Select/Select'
export type ProductFurnitureComponent = {
  type: 'furniture'
}
interface ProductSelectProps {
  configuration: ProductFurnitureComponent
}
export const ProductFurniture: FC<ProductSelectProps> = () => {
  return (
    <div>
      <p>Furnitura</p>
      
      <label className={styles.furnitureLabel}>
        <p>Tip deschidere</p>
        <ButtonSelect
          options={openingOptions}
          defaultSelected={'maner'}
          onChange={() => {}}
        />
      </label>

      <label className={styles.furnitureLabel}>
        <p>Balamale</p>
        <FormControl>
          <Select options={['test standard', 'premium', 'deluxe']} />
        </FormControl>
      </label>
      <label className={styles.furnitureLabel}>
        <p>Glisiere</p>
        <FormControl>
          <Select options={['standard', 'premium', 'deluxe']} />
        </FormControl>
      </label>
    </div>
  )
}
