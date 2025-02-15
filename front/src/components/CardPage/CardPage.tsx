import React from 'react'
import styles from './CardPage.module.css'
import { Delete as FaTrash } from '@mui/icons-material'
import SelectColor from '~/components/SelectColor/SelectColor'

export const CardPage = () => {
  return (
    <div className={styles.cardContainer}>
      <h2 className={styles.title}>🛒 Coșul meu</h2>
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
        {[1, 2].map((item, index) => (
          <div className={styles.cartRow} key={index}>
            <span>{index + 1}</span>
            <span className={styles.productName}>Comodă pe piciorușe</span>
            <img
              className={styles.productImage}
              src="/sideboard.jpg"
              alt="Comodă"
            />
            <span className={styles.productDetails}>
              <b>Dimensiuni:</b>
              <br /> Înălțime: 2700 mm
              <br /> Lungime: 1230 mm
              <br />
              Adâncime: 600 mm
              <br /> <b>Aranjare rafturi:</b>
              <br /> Secțiunea 1: <b>Opțiunea 2</b>
              <br />
              Secțiunea 2: <b>Opțiunea 1</b>
              <br /> <b>Mobilier:</b> premium
            </span>
            <div className={styles.colorContainer}>
              <SelectColor
                size="small"
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
              <button className={styles.editButton}>Editează</button>
              <button className={styles.deleteButton}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.subtotalContainer}>
        <span className={styles.subtotalLabel}>Subtotal</span>
        <span className={styles.subtotalValue}>10400 MDL</span>
      </div>
      <button className={styles.cardButton}>Finalizați comanda</button>
    </div>
  )
}
