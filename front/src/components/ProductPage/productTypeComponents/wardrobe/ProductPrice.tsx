import React, { FC } from 'react'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { FormattedMessage } from 'react-intl'
export type ProductPriceComponent = {
  type: 'price'
  price: number
}
interface ProductPriceProps {
  configuration: ProductPriceComponent
  predefinedValue?: number
  onAddItem: () => void
}
export const ProductPrice: FC<ProductPriceProps> = ({
  configuration,
  onAddItem,
  predefinedValue,
}) => {
  return predefinedValue ? (
    <div className={styles.priceContainer}>
      <div className={styles.priceBlock}>
        <div className={styles.priceTitle}>
          <h4>
            <FormattedMessage id="homepage.configurator.price.title" />:
          </h4>
        </div>
        <div className={styles.price}>
          <h2>{predefinedValue}</h2>
          <h2>
            &nbsp;
            <FormattedMessage id="homepage.configurator.price.currencyLei" />
          </h2>
        </div>
      </div>
      <div className={styles.addToCartButtonContainer}>
        <CustomButton icon={<ShoppingCartIcon />} size="large" variant="danger">
          <FormattedMessage id="homepage.button.addToCart" />
        </CustomButton>
      </div>
    </div>
  ) : (
    <div className={styles.priceContainer}>
      <div className={styles.priceBlock}>
        <div className={styles.priceTitle}>
          <h4>
            <FormattedMessage id="homepage.configurator.priceFlexible.title" />
          </h4>
        </div>
        <div className={styles.price}>
          <h2>{configuration.price}</h2>
          <h2>
            &nbsp;
            <FormattedMessage id="homepage.configurator.price.currencyLei" />
          </h2>
        </div>
      </div>
      <div className={styles.addToCartButtonContainer}>
        <CustomButton
          icon={<ShoppingCartIcon />}
          size="large"
          variant="danger"
          onClick={onAddItem}
        >
          <FormattedMessage id="homepage.button.addToCart" />
        </CustomButton>
      </div>
    </div>
  )
}
