import { CustomButton } from '~/components/CustomButton/CustomButton'

export { Checkout }

import React, { useState } from 'react'
import styles from './Checkout.module.css'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('cash')

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <ShoppingBagIcon />
        Comanda mea
      </h2>

      <div className={styles.checkoutWrapper}>
        {/* Left Section: Order Details */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Detalii comandă</h3>

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
          </div>

          {/* Delivery Details */}
          <h4 className={styles.subTitle}>Livrare</h4>
          <div className={styles.formGroup}>
            <label>Localitatea</label>
            <input type="text" placeholder="Alegeți localitatea" />
          </div>
          <div className={styles.formGroup}>
            <label>Adresa completă</label>
            <input type="text" placeholder="str. XXXX, bl. X, ap. X" />
          </div>
          <div className={styles.formGroup}>
            <label>Comentariu la comandă</label>
            <textarea placeholder="Alegeți localitatea"></textarea>
          </div>

          {/* Payment Method */}
          <h4 className={styles.subTitle}>Modalitatea de plată</h4>
          <div className={styles.paymentMethods}>
            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              <img
                src="/checkout/wallet.svg"
                alt="Cash"
                className={styles.paymentIcon}
              />
              Numerar la primire
            </label>
            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                value="mia"
                checked={paymentMethod === 'mia'}
                onChange={() => setPaymentMethod('mia')}
              />
              <img
                src="/checkout/mia.png"
                alt="MIA"
                className={styles.paymentIcon}
              />
              MIA
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
              <div>
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
