import React, { FC } from 'react'
import { useRouter } from 'next/router'
import styles from './CartPage.module.css'
import DeleteIcon from '@mui/icons-material/Delete'
import SelectColor from '~/components/SelectColor/SelectColor'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage, useIntl } from 'react-intl'
import { CartItem, useCart } from '~/context/cartContext'

const ItemRow: FC<{ item: CartItem; index: number }> = ({ item, index }) => {
  const { removeItem } = useCart()
  console.log('CartItem →', item)
  const intl = useIntl()

  const itemConfig = {
    dimensions: { width: 0, height: 0, depth: 0, plintHeight: 0 },
    colors: '',
    furniture: { hinges: '', guides: '', openingType: '' },
    price: 0,
    imageCarousel: '',
  }

  for (const config of item.config) {
    switch (config.type) {
      case 'imageCarousel':
        itemConfig.imageCarousel = config.predefinedValue ?? config.images[0]
        break
      case 'dimensions':
        itemConfig.dimensions = {
          width: config.predefinedValue?.width ?? config.width,
          height: config.predefinedValue?.height ?? config.height,
          depth: config.predefinedValue?.depth ?? config.depth,
          plintHeight:
            config.predefinedValue?.plintHeight ?? config.plintHeight,
        }
        break
      case 'colors':
        itemConfig.colors = config.predefinedValue ?? config.selectedColor
        break
      case 'furniture':
        itemConfig.furniture = {
          hinges: config.predefinedValue?.hinges ?? config.hinges,
          guides: config.predefinedValue?.guides ?? config.guides,
          openingType:
            config.predefinedValue?.openingType ?? config.selectedOpeningMethod,
        }
        break
      case 'price':
        itemConfig.price = config.predefinedValue ?? config.price
        break
    }
  }

  return (
    <div className={styles.cartRow} key={index}>
      <span className={styles.indexRow}>{index + 1}</span>
      <span className={styles.productName}>
        {item.name === 'wardrobe'
          ? intl.formatMessage({ id: 'homepage.products.wardrobe' })
          : intl.formatMessage({ id: 'homepage.products.dulap' })}
      </span>
      <div className={styles.productImageContainer}>
        <img
          className={styles.productImage}
          src={itemConfig.imageCarousel}
          alt={intl.formatMessage({ id: 'homepage.products.wardrobe' })}
        />
      </div>
      <span className={styles.productDetails}>
        <FormattedMessage id="homepage.configurator.dimensions.title" />:
        <br />
        <FormattedMessage id="homepage.configurator.dimensions.width" />:{' '}
        <b>
          {itemConfig.dimensions.width}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <br />
        <FormattedMessage id="homepage.configurator.dimensions.height" />:{' '}
        <b>
          {itemConfig.dimensions.height}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <br />
        <FormattedMessage id="homepage.configurator.dimensions.depth" />:{' '}
        <b>
          {itemConfig.dimensions.depth}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <br />
        <FormattedMessage id="homepage.configurator.dimensions.plintHeight" />:{' '}
        <b>
          {itemConfig.dimensions.plintHeight}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <br />
        <br />
        <FormattedMessage id="homepage.configurator.fittings.title" />:
        <br />
        <FormattedMessage id="homepage.configurator.fittings.handleType" />:{' '}
        <b>{intl.formatMessage({ id: itemConfig.furniture.openingType })}</b>
        <br />
        <FormattedMessage id="homepage.configurator.fittings.hinges" />:{' '}
        <b>{intl.formatMessage({ id: itemConfig.furniture.hinges })}</b>
        <br />
        <FormattedMessage id="homepage.configurator.fittings.guides" />:{' '}
        <b>{intl.formatMessage({ id: itemConfig.furniture.guides })}</b>
      </span>
      <div className={styles.colorContainer}>
        <SelectColor
          size="medium"
          colors={[itemConfig.colors]}
          onChange={() => {}}
        />
      </div>
      <span className={styles.price}>
        {itemConfig.price}{' '}
        <FormattedMessage id="homepage.configurator.price.currencyLei" />
      </span>
      <div className={styles.actions}>
        <CustomButton
          icon={<DeleteIcon fontSize="inherit" />}
          size="large"
          aria-label="delete"
          onClick={() => removeItem(index)}
        />
      </div>
    </div>
  )
}

export const CartPage: FC = () => {
  const router = useRouter()
  const { items } = useCart()

  const rawTotal = items.reduce((sum, { config }) => {
    const priceConfig = config.find((c) => c.type === 'price')
    return sum + (priceConfig?.predefinedValue ?? priceConfig?.price ?? 0)
  }, 0)

  const isEmpty = items.length === 0 || rawTotal === 0

  return (
    <div className={styles.cartContainer}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          <FormattedMessage id="cart.title" />
        </p>
      </div>

      {isEmpty ? (
        <p className={styles.emptyCartMessage}>
          <FormattedMessage id="cart.emptyCart" />
        </p>
      ) : (
        <>
          <div className={styles.cartTable}>
            <div className={styles.cartHeader}>
              <span>
                <FormattedMessage id="cart.tableHeader.no" />
              </span>
              <span>
                <FormattedMessage id="cart.tableHeader.productName" />
              </span>
              <span>
                <FormattedMessage id="cart.tableHeader.model" />
              </span>
              <span>
                <FormattedMessage id="cart.tableHeader.characteristics" />
              </span>
              <span>
                <FormattedMessage id="cart.tableHeader.color" />
              </span>
              <span>
                <FormattedMessage id="cart.tableHeader.price" />
              </span>
              <span>
                <FormattedMessage id="cart.tableHeader.actions" />
              </span>
            </div>
            {items.map((item, index) => (
              <ItemRow item={item} key={index} index={index} />
            ))}
          </div>
          <div className={styles.subtotalContainer}>
            <span className={styles.subtotalLabel}>
              <FormattedMessage id="cart.subtotal" />
            </span>
            <span className={styles.subtotalValue}>
              {rawTotal}{' '}
              <FormattedMessage id="homepage.configurator.price.currencyLei" />
            </span>
          </div>
        </>
      )}

      <div className={styles.ctaButtonContainer}>
        {!isEmpty ? (
          <CustomButton size="medium" onClick={() => router.push('/checkout')}>
            <FormattedMessage id="homepage.button.finalizeOrder" />
          </CustomButton>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
