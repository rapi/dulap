import { CustomButton } from '~/components/CustomButton/CustomButton'
import { grey } from '@mui/material/colors'

export { Checkout }

import React, { useState } from 'react'
import styles from './Checkout.module.css'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('cash')

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <ShoppingBagIcon
          fontSize="large"
          sx={{ color: grey[800] }}
        ></ShoppingBagIcon>
        <p className={styles.title}>Comanda mea</p>
      </div>

      <div className={styles.checkoutWrapper}>
        {/* Left Section: Order Details */}
        <div className={styles.detailsSection}>
          <h4 className={styles.subtitle}>Detalii comandă</h4>

          {/* Personal Details */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Numele Prenumele</label>
              <input type="text" placeholder="Numele Prenumele" />
            </div>
            <div className={styles.formGroup}>
              <label>Numărul de telefon</label>
              <input type="text" placeholder="0 (xx) xxx xxx" />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="text" placeholder="0 (xx) xxx xxx" />
            </div>
          </div>

          {/* Delivery Details */}
          <h4 className={styles.subtitle}>Livrare</h4>
          <div className={styles.deliveryInputContainer}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Localitatea</label>
                <input type="text" placeholder="Alegeți localitatea" />
              </div>
              <div className={styles.formGroup}>
                <label>Adresa completă</label>
                <input type="text" placeholder="str. XXXX, bl. X, ap. X" />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Comentariu la comandă</label>
              <textarea placeholder="Alegeți localitatea"></textarea>
            </div>
          </div>

          {/* Payment Method */}
          <h4 className={styles.subtitle}>Modalitatea de plată</h4>
          <div className={styles.paymentMethods}>
            <label className={styles.paymentOption}>
              <img
                src="/[locale]/checkout.tsx/wallet.svg"
                alt="Cash"
                className={styles.paymentIcon}
              />
              <p className={styles.paymentTitle}>Numerar la primire</p>
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
              <p className={styles.paymentTitle}>MIA</p>
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
                <p className={styles.productTitle}>Comodă pe piciorușe</p>
                <p className={styles.productSize}>2400x1200x600mm</p>
                <p className={styles.productPrice}>5200 MDL</p>
              </div>
            </div>

            <div className={styles.productItem}>
              <img
                src="/sideboard.jpg"
                alt="Comodă"
                className={styles.productImage}
              />
              <div>
                <p className={styles.productTitle}>Comodă pe piciorușe</p>
                <p className={styles.productSize}>2400x1200x600mm</p>
                <p className={styles.productPrice}>5200 MDL</p>
              </div>
            </div>

            <div className={styles.totalSection}>
              <p>
                Total: <span>10400 MDL</span>
              </p>
              <p>
                Livrare: <span>0 MDL</span>
              </p>
              <p className={styles.finalTotal}>
                Total spre achitare: <span>10400 MDL</span>
              </p>
            </div>

            <CustomButton>Plasează comanda</CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}
