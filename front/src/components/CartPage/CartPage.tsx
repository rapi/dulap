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
  const { removeItem } = useCart() // Assuming useCart is defined in your context

  const itemConfig = {
    dimensions: '',
    colors: '',
    furniture: '',
    price: 0,
    imageCarousel: '',
  }
  const intl = useIntl()

  for (const config of item.config)
    switch (config.type) {
      case 'imageCarousel':
        itemConfig.imageCarousel = config.images[0]
        break

      case 'dimensions':
        itemConfig.dimensions = `${config.width}x${config.height}x${config.depth} cm`
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
        <br /> <FormattedMessage id="homepage.configurator.dimensions.width" />:
        &nbsp;
        <b>
          {itemConfig.dimensions}{' '}
          <FormattedMessage id="homepage.configurator.dimensions.cm" />
        </b>
        <FormattedMessage id="homepage.configurator.dimensions.plintHeight" />:
        &nbsp;
        <br />
        <br />
        <FormattedMessage id="homepage.configurator.fittings.title" />:
        <br />{' '}
        <FormattedMessage id="homepage.configurator.fittings.handleType" />:{' '}
        <b>{itemConfig.furniture}</b>
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
  const { items } = useCart() // Assuming useCart is defined in your context

  const totalPrice = items.reduce((sum, { config }) => {
    const price = config.find((c) => c.type === 'price') as
      | { price: number }
      | undefined
    return sum + (price?.price ?? 0)
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
          // const dimensions = config.find((c) => c.type === 'dimensions') as {
          //   width: number
          //   height: number
          //   depth: number
          //   plintHeight: number
          // }
          //
          // const colors = config.find((c) => c.type === 'colors') as {
          //   selectedColor: string
          // }
          //
          // const furniture = config.find((c) => c.type === 'furniture') as {
          //   selectedOpeningMethod: string
          //   hinges: string
          //   guides: string
          // }
          //
          // const price = config.find((c) => c.type === 'price') as {
          //   price: number
          // }
          //
          // const imageCarousel = config.find(
          //   (c) => c.type === 'imageCarousel'
          // ) as {
          //   images: string[]
          // }
          //
          // return (
          //   <div className={styles.cartRow} key={index}>
          //     <span>{index + 1}</span>
          //     <span className={styles.productName}>
          //       {item.name === 'wardrobe'
          //         ? intl.formatMessage({ id: 'homepage.products.wardrobe' })
          //         : intl.formatMessage({ id: 'homepage.products.dulap' })}
          //     </span>
          //     <div className={styles.productImageContainer}>
          //       <img
          //         className={styles.productImage}
          //         src={imageCarousel.images[0]}
          //         alt="Comodă"
          //       />
          //     </div>
          //     <span className={styles.productDetails}>
          //       <FormattedMessage id="homepage.configurator.dimensions.title" />
          //       :
          //       <br />{' '}
          //       <FormattedMessage id="homepage.configurator.dimensions.width" />
          //       : &nbsp;
          //       <b>
          //         {dimensions.width}{' '}
          //         <FormattedMessage id="homepage.configurator.dimensions.cm" />
          //       </b>
          //       <br />{' '}
          //       <FormattedMessage id="homepage.configurator.dimensions.height" />
          //       : &nbsp;
          //       <b>
          //         {dimensions.height}{' '}
          //         <FormattedMessage id="homepage.configurator.dimensions.cm" />
          //       </b>
          //       <br />
          //       <FormattedMessage id="homepage.configurator.dimensions.depth" />
          //       : &nbsp;
          //       <b>
          //         {dimensions.depth}{' '}
          //         <FormattedMessage id="homepage.configurator.dimensions.cm" />
          //       </b>
          //       <br />
          //       <FormattedMessage id="homepage.configurator.dimensions.plintHeight" />
          //       : &nbsp;
          //       <b>
          //         {dimensions.plintHeight}{' '}
          //         <FormattedMessage id="homepage.configurator.dimensions.cm" />
          //       </b>
          //       <br />
          //       <br />
          //       <FormattedMessage id="homepage.configurator.fittings.title" />:
          //       <br />{' '}
          //       <FormattedMessage id="homepage.configurator.fittings.handleType" />
          //       : <b>{furniture.selectedOpeningMethod}</b>
          //       <br />{' '}
          //       <FormattedMessage id="homepage.configurator.fittings.hinges" />:{' '}
          //       <b>{intl.formatMessage({ id: furniture.hinges })}</b>
          //       {/* item.config[3].hinges */}
          //       <br />{' '}
          //       <FormattedMessage id="homepage.configurator.fittings.guides" />:{' '}
          //       <b>{intl.formatMessage({ id: furniture.guides })}</b>
          //       <br />
          //     </span>
          //     <div className={styles.colorContainer}>
          //       <SelectColor
          //         size="medium"
          //         colors={[colors.selectedColor]}
          //         onChange={() => {}}
          //       />
          //     </div>
          //     <span className={styles.price}>
          //       {price.price}{' '}
          //       <FormattedMessage id="homepage.configurator.price.currencyLei" />
          //     </span>
          //     <div className={styles.actions}>
          //       <IconButton size="large" onClick={() => removeItem(index)}>
          //         <FaTrash />
          //       </IconButton>
          //     </div>
          //   </div>
          // )
        })}
      </div>
      <div className={styles.subtotalContainer}>
        <span className={styles.subtotalLabel}>
          <FormattedMessage id="cart.subtotal" />
        </span>
        <span className={styles.subtotalValue}>
          {totalPrice}{' '}
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
