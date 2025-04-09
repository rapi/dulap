import React, { FC } from 'react'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
export type ProductPriceComponent = {
  type: 'price'
  price: number
}
interface ProductPriceProps {
  configuration: ProductPriceComponent
}
export const ProductPrice: FC<ProductPriceProps> = ({ configuration }) => {
  return (
    <div className={styles.priceContainer}>
      <div className={styles.priceBlock}>
        <div className={styles.priceTitle}>
          <h4>Preț flexibil:</h4>
        </div>
        <div className={styles.price}>
          <h2>{configuration.price}</h2>
          <h2>&nbsp;lei</h2>
        </div>
      </div>
      <div className={styles.addToCartButtonContainer}>
        <CustomButton icon={<ShoppingCartIcon />} size="large" variant="danger">
          Adaugă în coș
        </CustomButton>
      </div>
    </div>
  )
}
