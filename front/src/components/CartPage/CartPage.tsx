import React from 'react'
import { useRouter } from 'next/router'
import styles from './CartPage.module.css'
import { Delete as FaTrash } from '@mui/icons-material'
import SelectColor from '~/components/SelectColor/SelectColor'
import { IconButton } from '@mui/material'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'
import { useCart } from '~/context/cartContext'

export const CartPage = () => {
  const router = useRouter()
  
  const { items, removeItem } = useCart(); // Assuming useCart is defined in your context
  console.log('items ', items);
  const intl = useIntl();
  const totalPrice = items.reduce(
    (sum, { config }) => sum + (config[4]?.price ?? 0),
    0
  )
  
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
        {items.map((_item, index) => (
          <div className={styles.cartRow} key={index}>
            <span>{index + 1}</span>
            <span className={styles.productName}>
              {_item.name === 'wardrobe' ? intl.formatMessage({ id: 'homepage.products.wardrobe' }) : intl.formatMessage({ id: 'homepage.products.dulap' })}
            </span>
            <div className={styles.productImageContainer}>
              <img
                className={styles.productImage}
                src={_item.config[5].images[0]}
                alt="Comodă"
              />
            </div>
            <span className={styles.productDetails}>
              <FormattedMessage id="homepage.configurator.dimensions.title" />:
              <br />{' '}
              <FormattedMessage id="homepage.configurator.dimensions.width" />:
              &nbsp;
              <b>
                {_item.config[0].width}{' '}
                <FormattedMessage id="homepage.configurator.dimensions.cm" />
              </b>
              <br />{' '}
              <FormattedMessage id="homepage.configurator.dimensions.height" />:
              &nbsp;
              <b>
                {_item.config[0].height}{' '}
                <FormattedMessage id="homepage.configurator.dimensions.cm" />
              </b>
              <br />
              <FormattedMessage id="homepage.configurator.dimensions.depth" />:
              &nbsp;
              <b>
                {_item.config[0].depth}{' '}
                <FormattedMessage id="homepage.configurator.dimensions.cm" />
              </b>
              <br />
              <FormattedMessage id="homepage.configurator.dimensions.plintHeight" />
              : &nbsp;
              <b>
                {_item.config[0].plintHeight}{' '}
                <FormattedMessage id="homepage.configurator.dimensions.cm" />
              </b>
              <br />
              <br />
              <FormattedMessage id="homepage.configurator.fittings.title" />:
              <br />{' '}
              <FormattedMessage id="homepage.configurator.fittings.handleType" />
              : <b>{_item.config[3].selectedOpeningMethod}</b>
              <br />{' '}
              <FormattedMessage id="homepage.configurator.fittings.hinges" />:{' '}
              <b>{intl.formatMessage({ id: _item.config[3].hinges })}</b>
              {/* _item.config[3].hinges */}
              <br />{' '}
              <FormattedMessage id="homepage.configurator.fittings.guides" />:{' '}
              <b>{intl.formatMessage({ id: _item.config[3].guides })}</b>
              <br />
            </span>
            <div className={styles.colorContainer}>
              <SelectColor
                size="medium"
                colors={[_item.config[1].selectedColor]}
                onChange={() => {}}
              />
            </div>
            <span className={styles.price}>
              {_item.config[4].price}{' '}
              <FormattedMessage id="homepage.configurator.price.currencyLei" />
            </span>
            <div className={styles.actions}>
              <IconButton
                size="large"
                onClick={() => removeItem(index)}
              >
                <FaTrash />
              </IconButton>
            </div>
          </div>
        ))}
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
        <CustomButton icon="" size="medium" onClick={() => router.push('/checkout')}>
          <FormattedMessage id="homepage.button.finalizeOrder" />
        </CustomButton>
      </div>
    </div>
  )
}
