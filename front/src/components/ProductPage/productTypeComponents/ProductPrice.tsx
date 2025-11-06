import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage } from 'react-intl'
export type ProductPriceComponent = {
  type: 'price'
  price: number
  predefinedValue?: number
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
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const price = predefinedValue ?? configuration.price

  const round10 = (n: number): number => Math.round(n / 10) * 10

  const roundedCrossedPrice = round10(price * 1.1)
  return (
    <div>
      <div className={styles.priceRow}>
        <div className={styles.priceBox}>
          <p className={styles.newPrice}>{price}</p>
          <p className={styles.newPrice}>
            &nbsp;
            <FormattedMessage id="homepage.configurator.price.currencyLei" />
          </p>
          <p className={styles.crossedPrice}>
            {roundedCrossedPrice}&nbsp;
            <FormattedMessage id="homepage.configurator.price.currencyLei" />
          </p>
        </div>

        <div className={styles.addToCartButtonContainer}>
          <CustomButton
            icon={<ShoppingCartIcon />}
            size="medium"
            variant="danger"
            onClick={() => {
              setIsModalOpen(true)
              onAddItem()
            }}
            outlined
          >
            <FormattedMessage id="homepage.button.addToCart" />
          </CustomButton>
          <p className={styles.underBtnText}>
            <FormattedMessage id="btn.textBelow.delivery" />
          </p>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
      >
        <h3>
          <FormattedMessage id="modal.addedToCart.title" />
        </h3>
        <div className={styles.buttonRow}>
          <CustomButton onClick={() => router.push('/cart')}>
            <FormattedMessage id="homepage.button.openCart" />
          </CustomButton>
          <CustomButton variant="grey" onClick={() => router.push('/')}>
            <FormattedMessage id="homepage.button.backToPurchase" />
          </CustomButton>
        </div>
      </Modal>
    </div>
  )
}
