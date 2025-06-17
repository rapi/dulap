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
  const titleId = predefinedValue
    ? 'homepage.configurator.price.title'
    : 'homepage.configurator.priceFlexible.title'
  return (
    <div>
      <div className={styles.priceContainer}>
        <div className={styles.priceBlock}>
          <div className={styles.priceTitle}>
            <h4>
              <FormattedMessage id={titleId} />:
            </h4>
          </div>
          <div className={styles.price}>
            <h2>{price}</h2>
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
            onClick={() => {
              setIsModalOpen(true)
              onAddItem()
            }}
          >
            <FormattedMessage id="homepage.button.addToCart" />
          </CustomButton>
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
