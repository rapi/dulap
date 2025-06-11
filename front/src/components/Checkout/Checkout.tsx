import { CustomButton } from '~/components/CustomButton/CustomButton'
import { grey } from '@mui/material/colors'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'
import { useCart } from '~/context/cartContext'

export { Checkout }

import React, { useState } from 'react'
import styles from './Checkout.module.css'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const intl = useIntl()

  const { items } = useCart(); // Assuming useCart is defined in your context
  console.log('items ', items);
  const totalPrice = items.reduce(
    (sum, { config }) => sum + (config[4]?.price ?? 0),
    0
  );
  const deliveryPrice = 0;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <ShoppingBagIcon
          fontSize="large"
          sx={{ color: grey[800] }}
        ></ShoppingBagIcon>
        <p className={styles.title}>
          <FormattedMessage id="checkout.title" />
        </p>
      </div>

      <div className={styles.checkoutWrapper}>
        {/* Left Section: Order Details */}
        <div className={styles.detailsSection}>
          <h4 className={styles.subtitle}>
            <FormattedMessage id="checkout.subtitle1.orderDetails" />
          </h4>

          {/* Personal Details */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>
                <FormattedMessage id="checkout.nameSurname" />
              </label>
              <input
                type="text"
                placeholder={intl.formatMessage({ id: 'checkout.nameSurname' })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>
                <FormattedMessage id="checkout.phoneNumber" />
              </label>
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: 'checkout.phoneNumber.placeholder',
                })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>
                <FormattedMessage id="checkout.email" />
              </label>
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: 'checkout.email.placeholder',
                })}
              />
            </div>
          </div>

          {/* Delivery Details */}
          <h4 className={styles.subtitle}>
            <FormattedMessage id="checkout.subtitle2.delivery" />
          </h4>
          <div className={styles.deliveryInputContainer}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>
                  <FormattedMessage id="checkout.city" />
                </label>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: 'checkout.city.placeholder',
                  })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <FormattedMessage id="checkout.fullAddress" />
                </label>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: 'checkout.fullAddress.placeholder',
                  })}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>
                <FormattedMessage id="checkout.comment" />
              </label>
              <textarea
                placeholder={intl.formatMessage({
                  id: 'checkout.comment.placeholder',
                })}
              ></textarea>
            </div>
          </div>

          {/* Payment Method */}
          <h4 className={styles.subtitle}>
            <FormattedMessage id="checkout.subtitle3.paymentOption" />
          </h4>
          <div className={styles.paymentMethods}>
            <label className={styles.paymentOption}>
              <img
                src="/checkout/wallet.svg"
                alt="Cash"
                className={styles.paymentIcon}
              />
              <p className={styles.paymentTitle}>
                <FormattedMessage id="checkout.paymentOption.cash" />
              </p>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
            </label>
            <label className={styles.paymentOption}>
              <img
                src="/checkout/mia.png"
                alt="MIA"
                className={styles.paymentIcon}
              />
              <p className={styles.paymentTitle}>
                <FormattedMessage id="checkout.paymentOption.MIA" />
              </p>
              <input
                type="radio"
                name="payment"
                value="mia"
                checked={paymentMethod === 'mia'}
                onChange={() => setPaymentMethod('mia')}
              />
            </label>
          </div>
        </div>

        {/* Right Section: Order Summary */}
        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            {items.map((_item, index) => (
              <div className={styles.productItem} key={index}>
                <img
                  src={_item.config[5].images[0]}
                  alt="Comodă"
                  className={styles.productImage}
                />
                <div className={styles.productdetails}>
                  <p className={styles.productTitle}>
                    {_item.name === 'wardrobe' ? intl.formatMessage({ id: 'homepage.products.wardrobe' }) : intl.formatMessage({ id: 'homepage.products.dulap' })}
                  </p>
                  <p className={styles.productSize}>
                    {_item.config[0].width} x {_item.config[0].height} x {_item.config[0].depth}{' '}
                    <FormattedMessage id="homepage.configurator.dimensions.cm" />
                  </p>
                  <p className={styles.productPrice}>
                    {_item.config[4].price}{' '}
                    <FormattedMessage id="homepage.configurator.price.currencyLei" />
                  </p>
                </div>
              </div>
            ))}

            <div className={styles.totalSection}>
              <p>
                <FormattedMessage id="checkout.subtotal" />{' '}
                <span>
                  {totalPrice}{' '}
                  <FormattedMessage id="homepage.configurator.price.currencyLei" />
                </span>
              </p>
              <p>
                <FormattedMessage id="checkout.delivery" />{' '}
                <span>
                  {deliveryPrice}{' '}
                  <FormattedMessage id="homepage.configurator.price.currencyLei" />
                </span>
              </p>
              <p className={styles.finalTotal}>
                <FormattedMessage id="checkout.totalToPay" />{' '}
                <span>
                  {totalPrice + deliveryPrice}{' '}
                  <FormattedMessage id="homepage.configurator.price.currencyLei" />
                </span>
              </p>
            </div>

            <CustomButton>
              <FormattedMessage id="homepage.button.placeOrder" />
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}
