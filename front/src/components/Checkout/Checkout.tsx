import { CustomButton } from '~/components/CustomButton/CustomButton'
import { grey } from '@mui/material/colors'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl';

export { Checkout }

import React, { useState } from 'react'
import styles from './Checkout.module.css'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <ShoppingBagIcon
          fontSize="large"
          sx={{ color: grey[800] }}
        ></ShoppingBagIcon>
        <p className={styles.title}><FormattedMessage id="checkout.title"/></p>
      </div>

      <div className={styles.checkoutWrapper}>
        {/* Left Section: Order Details */}
        <div className={styles.detailsSection}>
          <h4 className={styles.subtitle}><FormattedMessage id="checkout.subtitle1.orderDetails"/></h4>

          {/* Personal Details */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label><FormattedMessage id="checkout.nameSurname"/></label>
              <input type="text" placeholder={intl.formatMessage({ id: 'checkout.nameSurname' })} />
            </div>
            <div className={styles.formGroup}>
              <label><FormattedMessage id="checkout.phoneNumber"/></label>
              <input type="text" placeholder={intl.formatMessage({ id: 'checkout.phoneNumber.placeholder' })} />
            </div>
            <div className={styles.formGroup}>
              <label><FormattedMessage id="checkout.email"/></label>
              <input type="text" placeholder={intl.formatMessage({ id: 'checkout.email.placeholder' })} />
            </div>
          </div>

          {/* Delivery Details */}
          <h4 className={styles.subtitle}><FormattedMessage id="checkout.subtitle2.delivery"/></h4>
          <div className={styles.deliveryInputContainer}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label><FormattedMessage id="checkout.city"/></label>
                <input type="text" placeholder={intl.formatMessage({ id: 'checkout.city.placeholder' })} />
              </div>
              <div className={styles.formGroup}>
                <label><FormattedMessage id="checkout.fullAddress"/></label>
                <input type="text" placeholder={intl.formatMessage({ id: 'checkout.fullAddress.placeholder' })} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label><FormattedMessage id="checkout.comment"/></label>
              <textarea placeholder={intl.formatMessage({ id: 'checkout.comment.placeholder' })} ></textarea>
            </div>
          </div>

          {/* Payment Method */}
          <h4 className={styles.subtitle}><FormattedMessage id="checkout.subtitle3.paymentOption"/></h4>
          <div className={styles.paymentMethods}>
            <label className={styles.paymentOption}>
              <img
                src="/[locale]/checkout.tsx/wallet.svg"
                alt="Cash"
                className={styles.paymentIcon}
              />
              <p className={styles.paymentTitle}><FormattedMessage id="checkout.paymentOption.cash"/></p>
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
                src="/[locale]/checkout.tsx/mia.png"
                alt="MIA"
                className={styles.paymentIcon}
              />
              <p className={styles.paymentTitle}><FormattedMessage id="checkout.paymentOption.MIA"/></p>
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
            <div className={styles.productItem}>
              <img
                src="/sideboard.jpg"
                alt="Comodă"
                className={styles.productImage}
              />
              <div className={styles.productdetails}>
                <p className={styles.productTitle}>NAME</p>
                <p className={styles.productSize}>width x height x depth <FormattedMessage id="homepage.configurator.dimensions.cm"/></p>
                <p className={styles.productPrice}>5200 <FormattedMessage id="homepage.configurator.price.currencyLei"/></p>
              </div>
            </div>

            <div className={styles.totalSection}>
              <p>
                <FormattedMessage id="checkout.subtotal"/> <span>10400 <FormattedMessage id="homepage.configurator.price.currencyLei"/></span>
              </p>
              <p>
                <FormattedMessage id="checkout.delivery"/> <span>0 <FormattedMessage id="homepage.configurator.price.currencyLei"/></span>
              </p>
              <p className={styles.finalTotal}>
                <FormattedMessage id="checkout.totalToPay"/> <span>10400 <FormattedMessage id="homepage.configurator.price.currencyLei"/></span>
              </p>
            </div>

            <CustomButton><FormattedMessage id="homepage.button.placeOrder"/></CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}
