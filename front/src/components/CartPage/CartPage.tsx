import React from 'react'
import styles from './CartPage.module.css'
import { Delete as FaTrash } from '@mui/icons-material'
import SelectColor from '~/components/SelectColor/SelectColor'
import { CustomButton } from '~/components/CustomButton/CustomButton'

export const CartPage = () => {
  return (
    <div className={styles.cartContainer}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>Coșul meu</p>
      </div>
      <div className={styles.cartTable}>
        <div className={styles.cartHeader}>
          <span>N/o</span>
          <span>Denumirea produsului</span>
          <span>Modelul</span>
          <span>Caracteristici</span>
          <span>Culoarea</span>
          <span>Cantitate</span>
          <span>Preț total</span>
          <span>Acțiuni</span>
        </div>
        {[1, 2].map((_item, index) => (
          <div className={styles.cartRow} key={index}>
            <span>{index + 1}</span>
            <span className={styles.productName}>Comodă pe piciorușe</span>
            <div className={styles.productImageContainer}>
              <img
                className={styles.productImage}
                src="/sideboard.jpg"
                alt="Comodă"
              />
            </div>
            <span className={styles.productDetails}>
              Dimensiuni:
              <br /> Înălțime: <b>2700 mm</b>
              <br /> Lungime: <b>1230 mm</b>
              <br />
              Adâncime: <b>600 mm</b>
              <br />
              <br />
              Aranjare rafturi:
              <br /> Secțiunea 1: <b>Opțiunea 2</b>
              <br />
              Secțiunea 2: <b>Opțiunea 1</b>
              <br />
              <br />
              Furnitura: <b>premium</b>
            </span>
            <div className={styles.colorContainer}>
              <SelectColor
                size="medium"
                colors={['#d7d0c5']}
                onChange={() => {}}
              />
            </div>
            <div className={styles.quantityControl}>
              <button className={styles.quantityButton}>-</button>
              <span className={styles.quantityValue}>1</span>
              <button className={styles.quantityButton}>+</button>
            </div>
            <span className={styles.price}>5200 MDL</span>
            <div className={styles.actions}>
              <CustomButton icon="" size="small" outlined>
                Editează
              </CustomButton>
              <CustomButton
                icon={<FaTrash />}
                size="small"
                outlined
              ></CustomButton>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.subtotalContainer}>
        <span className={styles.subtotalLabel}>Subtotal</span>
        <span className={styles.subtotalValue}>10400 MDL</span>
      </div>
      {/* <button className={styles.cartButton}>Finalizați comanda</button> */}
      <div className={styles.ctaButtonContainer}>
        <CustomButton icon="" size="medium" outlined>
          Finalizați comanda
        </CustomButton>
      </div>
    </div>
  )
}
