import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ShareIcon from '@mui/icons-material/Share'
import { Modal } from '~/components/Modal/Modal'
import { ShareConfigModal } from '~/components/ShareConfigModal/ShareConfigModal'
import { FormattedMessage } from 'react-intl'
import type { BaseConfig } from '~/utils/configTypes'
import type { ProductKey } from '~/utils/configUrl'

export type ProductPriceComponent = {
  type: 'price'
  price: number
  predefinedValue?: number
}
interface ProductPriceProps {
  configuration: ProductPriceComponent
  predefinedValue?: number
  onAddItem: () => void
  // Optional: for share functionality
  shareConfig?: BaseConfig
  shareProduct?: ProductKey
}
export const ProductPrice: FC<ProductPriceProps> = ({
  configuration,
  onAddItem,
  predefinedValue,
  shareConfig,
  shareProduct,
}) => {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const price = predefinedValue ?? configuration.price

  const round10 = (n: number): number => Math.round(n / 10) * 10

  const roundedCrossedPrice = round10(price * 1.1)
  
  // Get locale from router
  const locale = (router.query.locale as string) || 'ro'
  
  // Determine if share button should be shown
  const canShare = shareConfig && shareProduct
  
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
          {canShare && (
            <CustomButton
              icon={<ShareIcon />}
              size="medium"
              variant="primary"
              onClick={() => setIsShareModalOpen(true)}
              outlined
            >
              <FormattedMessage id="homepage.button.share" />
            </CustomButton>
          )}

          <div className={styles.cartButtonWrapper}>
            <CustomButton
              icon={<ShoppingCartIcon />}
              size="medium"
              variant="primary"
              onClick={() => {
                setIsModalOpen(true)
                onAddItem()
              }}
            >
              <FormattedMessage id="homepage.button.addToCart" />
            </CustomButton>
            <p className={styles.underBtnText}>
              <FormattedMessage id="btn.textBelow.delivery" />
            </p>
          </div>
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
      
      {canShare && (
        <ShareConfigModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          config={shareConfig}
          product={shareProduct}
          locale={locale}
        />
      )}
    </div>
  )
}
