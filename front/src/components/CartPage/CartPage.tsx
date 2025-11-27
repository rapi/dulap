// components/CartPage/CartPage.tsx
import React, { FC } from 'react'
import { useRouter } from 'next/router'
import styles from './CartPage.module.css'
import DeleteIcon from '@mui/icons-material/Delete'
import SelectColor from '~/components/SelectColor/SelectColor'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  CartItem,
  CartProductItem,
  CartSampleItem,
  useCart,
} from '~/context/cartContext'

// ✅ strict, no `any`
const isProductItem = (it: CartItem): it is CartProductItem =>
  it.type === 'product'
const isSampleItem = (it: CartItem): it is CartSampleItem =>
  it.type === 'sample'

// ✅ function declaration avoids "assigned a value but never used"
function ItemRow({ item, index }: { item: CartItem; index: number }) {
  const { removeItem } = useCart()
  const intl = useIntl()

  const vm = {
    displayName: '',
    image: '',
    dimensions: {
      width: null as number | null,
      height: null as number | null,
      depth: null as number | null,
      plintHeight: null as number | null,
    },
    color: '' as string,
    furniture: { hinges: '', guides: '', openingType: '' },
    price: 0 as number,
  }

  if (isProductItem(item)) {
    switch (item.name) {
      case 'wardrobe':
        vm.displayName = intl.formatMessage({
          id: 'homepage.products.wardrobe',
        })
        break
      case 'stand':
        vm.displayName = intl.formatMessage({ id: 'homepage.products.stand' })
        break
      case 'tv-stand':
        vm.displayName = intl.formatMessage({ id: 'homepage.products.TVstand' })
        break
      case 'bedside':
        vm.displayName = intl.formatMessage({ id: 'homepage.products.bedside' })
        break
      default:
        vm.displayName = item.name
    }

    for (const config of item.config) {
      switch (config.type) {
        case 'imageCarousel':
          vm.image = config.predefinedValue ?? config.images[0]
          break
        case 'dimensions':
          vm.dimensions = {
            width: config.predefinedValue?.width ?? config.width,
            height: config.predefinedValue?.height ?? config.height,
            depth: config.predefinedValue?.depth ?? config.depth,
            plintHeight:
              config.predefinedValue?.plintHeight ?? config.plintHeight,
          }
          break
        case 'colors':
          vm.color = config.predefinedValue ?? config.selectedColor
          break
        case 'furniture':
          // Hinges may not exist for all furniture types (e.g., wardrobe doesn't have hinges)
          const predefinedValue = config.predefinedValue as { hinges?: string; guides?: string; openingType?: string } | undefined
          vm.furniture = {
            hinges: predefinedValue?.hinges ?? config.hinges ?? '',
            guides: config.predefinedValue?.guides ?? config.guides,
            openingType:
              config.predefinedValue?.openingType ??
              config.selectedOpeningMethod,
          }
          break
        case 'price':
          vm.price = config.predefinedValue ?? config.price
          break
      }
    }
  }

  if (isSampleItem(item)) {
    vm.displayName =
      item.name ||
      intl.formatMessage({
        id: 'cart.sample.defaultName',
        defaultMessage: 'Sample',
      })
    vm.image =
      item.sample.imageCarousel?.[0] ??
      `/products/samples/${item.sample.id}.png`
    vm.color = item.sample.color ?? ''
    vm.price = item.sample.price ?? 0
  }

  const hasDimensions = vm.dimensions.width !== null

  return (
    <div className={styles.cartRow} key={index}>
      <span className={styles.indexRow}>{index + 1}</span>

      <span className={styles.productName}>{vm.displayName}</span>

      <div className={styles.productImageContainer}>
        <img
          className={styles.productImage}
          src={vm.image}
          alt={vm.displayName}
        />
      </div>

      <span className={styles.productDetails}>
        {hasDimensions ? (
          <>
            <FormattedMessage id="homepage.configurator.dimensions.title" />:
            <br />
            <FormattedMessage id="homepage.configurator.dimensions.width" />:{' '}
            <b>
              {vm.dimensions.width}{' '}
              <FormattedMessage id="homepage.configurator.dimensions.cm" />
            </b>
            <br />
            <FormattedMessage id="homepage.configurator.dimensions.height" />:{' '}
            <b>
              {vm.dimensions.height}{' '}
              <FormattedMessage id="homepage.configurator.dimensions.cm" />
            </b>
            <br />
            <FormattedMessage id="homepage.configurator.dimensions.depth" />:{' '}
            <b>
              {vm.dimensions.depth}{' '}
              <FormattedMessage id="homepage.configurator.dimensions.cm" />
            </b>
            <br />
            <FormattedMessage id="homepage.configurator.dimensions.plintHeight" />
            :{' '}
            <b>
              {vm.dimensions.plintHeight}{' '}
              <FormattedMessage id="homepage.configurator.dimensions.cm" />
            </b>
            <br />
            <br />
            <FormattedMessage id="homepage.configurator.fittings.title" />:
            <br />
            {vm.furniture.openingType && (
              <span>
                <FormattedMessage id="homepage.configurator.fittings.handleType" />
                : <b>{intl.formatMessage({ id: vm.furniture.openingType })}</b>
              </span>
            )}
            <br />
            {vm.furniture.hinges && (
              <span>
                <FormattedMessage id="homepage.configurator.fittings.hinges" />:{' '}
                <b>{intl.formatMessage({ id: vm.furniture.hinges })}</b>
                <br />
              </span>
            )}
            <FormattedMessage id="homepage.configurator.fittings.guides" />:{' '}
            {vm.furniture.guides && (
              <b>{intl.formatMessage({ id: vm.furniture.guides })}</b>
            )}
          </>
        ) : (
          <span>—</span>
        )}
      </span>

      <div className={styles.colorContainer}>
        {vm.color ? (
          <SelectColor size="medium" colors={[vm.color]} onChange={() => {}} />
        ) : (
          <span>—</span>
        )}
      </div>

      <span className={styles.price}>
        {vm.price}{' '}
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

  const rawTotal = items.reduce((sum, item) => {
    if (isProductItem(item)) {
      const priceConfig = item.config.find((c) => c.type === 'price')
      return sum + (priceConfig?.predefinedValue ?? priceConfig?.price ?? 0)
    }
    if (isSampleItem(item)) {
      return sum + (item.sample.price ?? 0)
    }
    return sum
  }, 0)

  const isEmpty = items.length === 0

  return (
    <div className={styles.cartContainer}>
      {/* ...rest of your component stays the same, including <ItemRow /> usage... */}
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>
          <FormattedMessage id="cart.title" />
        </h1>
      </div>

      {isEmpty ? (
        <h2 className={styles.emptyCartMessage}>
          <FormattedMessage id="cart.emptyCart" />
        </h2>
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
        ) : null}
      </div>
    </div>
  )
}
