import React, { FC } from 'react'
import { useRouter } from 'next/router'
import styles from './CartPage.module.css'
import { Delete as FaTrash } from '@mui/icons-material'
import SelectColor from '~/components/SelectColor/SelectColor'
import { IconButton } from '@mui/material'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'
import { CartItem, useCart } from '~/context/cartContext'
const ItemRow: FC<{ item: CartItem; index: number }> = ({ item, index }) => {
  console.log(item)
  const { removeItem } = useCart()

  const itemConfig = {
    dimensions: { width: 0, height: 0, depth: 0, plintHeight: 0},
    colors: '',
    furniture: { hinges: '', guides: '', openingType: ''},
    price: 0,
    imageCarousel: '',
  }
  const intl = useIntl()

  for (const config of item.config)
    switch (config.type) {
      case 'imageCarousel':
        if (config.predefinedValue) {
          itemConfig.imageCarousel = config.predefinedValue
        } else itemConfig.imageCarousel = config.images[0]
        break

      case 'dimensions':
        if (config.predefinedValue) {
          itemConfig.dimensions.width = config.predefinedValue.width
          itemConfig.dimensions.height = config.predefinedValue.height
          itemConfig.dimensions.depth = config.predefinedValue.depth
          itemConfig.dimensions.plintHeight = config.predefinedValue.plintHeight
        } else {
          itemConfig.dimensions.width = config.width
          itemConfig.dimensions.height = config.height
          itemConfig.dimensions.depth = config.depth
          itemConfig.dimensions.plintHeight = config.plintHeight
        }
        break

      case 'colors':
        if (config.predefinedValue) {
          itemConfig.colors = config.predefinedValue
        } else itemConfig.colors = config.selectedColor
        break

      case 'furniture':
        if (config.predefinedValue) {
          itemConfig.furniture.guides = config.predefinedValue.guides
          itemConfig.furniture.hinges = config.predefinedValue.hinges
          itemConfig.furniture.openingType = config.predefinedValue.openingType
        } else {
          itemConfig.furniture.guides = config.guides
          itemConfig.furniture.hinges = config.hinges
          itemConfig.furniture.openingType = config.selectedOpeningMethod
        }
        break

      case 'colors':
        if (config.predefinedValue) {
          itemConfig.colors = config.predefinedValue
        } else itemConfig.colors = config.selectedColor
        break

      case 'price':
        if (config.predefinedValue) {
          itemConfig.price = config.predefinedValue
        } else itemConfig.price = config.price
        break
    }
  return (
    <div className={styles.cartRow} key={index}>
      <span>{index + 1}</span>
      <span className={styles.productName}>
        {item.name === 'wardrobe'
          ? intl.formatMessage({ id: 'homepage.products.wardrobe' })
          : intl.formatMessage({ id: 'homepage.products.dulap' })}
      </span>
      <div className={styles.productImageContainer}>
        <img
          className={styles.productImage}
          src={itemConfig.imageCarousel}
          alt="Comodă"
        />
      </div>
      <span className={styles.productDetails}>
        <FormattedMessage id="homepage.configurator.dimensions.title" />
        :
        <br />{' '}
        <FormattedMessage id="homepage.configurator.dimensions.width" />
        : &nbsp;
        <b>
          {itemConfig.dimensions.width}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <br />{' '}
        <FormattedMessage id="homepage.configurator.dimensions.height" />
        : &nbsp;
        <b>
          {itemConfig.dimensions.height}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <br />
        <FormattedMessage id="homepage.configurator.dimensions.depth" />
        : &nbsp;
        <b>
          {itemConfig.dimensions.depth}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <br />
        <FormattedMessage id="homepage.configurator.dimensions.plintHeight" />
        : &nbsp;
        <b>
          {itemConfig.dimensions.plintHeight}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <br />
        <br />
        <FormattedMessage id="homepage.configurator.fittings.title" />:
        <br />{' '}
        <FormattedMessage id="homepage.configurator.fittings.handleType" />
        : <b>{intl.formatMessage({ id: itemConfig.furniture.openingType })}</b>
        <br />{' '}
        <FormattedMessage id="homepage.configurator.fittings.hinges" />:{' '}
        <b>{intl.formatMessage({ id: itemConfig.furniture.hinges })}</b>
        <br />{' '}
        <FormattedMessage id="homepage.configurator.fittings.guides" />:{' '}
        <b>{intl.formatMessage({ id: itemConfig.furniture.guides })}</b>
        <br />
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
        <IconButton
          size="large"
          onClick={() => {
            removeItem(index)
          }}
        >
          <FaTrash />
        </IconButton>
      </div>
    </div>
  )
}
export const CartPage = () => {
  const router = useRouter()
  const { items } = useCart()

  const rawTotal = items.reduce((sum, { config }) => {
    let itemPrice = 0
    config.forEach(comp => {
      if (comp.type === 'price') {
        itemPrice = comp.predefinedValue ?? comp.price
      }
    })
    return sum + itemPrice
  }, 0)

  return (
    <div className={styles.cartContainer}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          <FormattedMessage id="cart.title" />
        </p>
      </div>
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

        {items.map((item, index) => {
          return <ItemRow item={item} key={item.name} index={index} />
        })}
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
      <div className={styles.ctaButtonContainer}>
        <CustomButton
          icon=""
          size="medium"
          onClick={() => router.push('/checkout')}
        >
          <FormattedMessage id="homepage.button.finalizeOrder" />
        </CustomButton>
      </div>
    </div>
  )
}
