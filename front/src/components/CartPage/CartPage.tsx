import React from 'react'
import styles from './CartPage.module.css'
import { Delete as FaTrash } from '@mui/icons-material'
import SelectColor from '~/components/SelectColor/SelectColor'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage } from 'react-intl'

export const CartPage = () => {
  return (
    <div className={styles.cartContainer}>
      <div className={styles.titleContainer}>
        <p className={styles.title}><FormattedMessage id="cart.title"/></p>
      </div>
      <div className={styles.cartTable}>
        <div className={styles.cartHeader}>
          <span><FormattedMessage id="cart.tableHeader.no"/></span>
          <span><FormattedMessage id="cart.tableHeader.productName"/></span>
          <span><FormattedMessage id="cart.tableHeader.model"/></span>
          <span><FormattedMessage id="cart.tableHeader.characteristics"/></span>
          <span><FormattedMessage id="cart.tableHeader.color"/></span>
          <span><FormattedMessage id="cart.tableHeader.price"/></span>
          <span><FormattedMessage id="cart.tableHeader.actions"/></span>
        </div>
        {[1, 2].map((_item, index) => (
          <div className={styles.cartRow} key={index}>
            <span>{index + 1}</span>
            <span className={styles.productName}>NUME</span>
            <div className={styles.productImageContainer}>
              <img
                className={styles.productImage}
                src="/sideboard.jpg"
                alt="Comodă"
              />
            </div>
            <span className={styles.productDetails}>
              <FormattedMessage id="homepage.configurator.dimensions.title"/>:
              <br /> <FormattedMessage id="homepage.configurator.dimensions.width"/>:  
              &nbsp;<b>2700 <FormattedMessage id="homepage.configurator.dimensions.cm"/></b>
              <br /> <FormattedMessage id="homepage.configurator.dimensions.height"/>: 
              &nbsp;<b>1230 <FormattedMessage id="homepage.configurator.dimensions.cm"/></b>
              <br />
              <FormattedMessage id="homepage.configurator.dimensions.depth"/>: 
              &nbsp;<b>600 <FormattedMessage id="homepage.configurator.dimensions.cm"/></b>
              <br />
              <FormattedMessage id="homepage.configurator.dimensions.plintHeight"/>: 
              &nbsp;<b>600 <FormattedMessage id="homepage.configurator.dimensions.cm"/></b>
              <br />
              <br />
              <FormattedMessage id="homepage.configurator.fittings.title"/>:
              <br /> <FormattedMessage id="homepage.configurator.fittings.handleType"/>: <b>mâner</b>
              <br /> <FormattedMessage id="homepage.configurator.fittings.hinges"/>: <b>econom</b>
              <br /> <FormattedMessage id="homepage.configurator.fittings.guides"/>: <b>econom</b>
              <br />
            </span>
            <div className={styles.colorContainer}>
              <SelectColor
                size="medium"
                colors={['#d7d0c5']}
                onChange={() => {}}
              />
            </div>
            <span className={styles.price}>5200 <FormattedMessage id="homepage.configurator.price.currencyLei"/></span>
            <div className={styles.actions}>
              <CustomButton size="small">
                <FormattedMessage id="homepage.button.edit"/>
              </CustomButton>
              <CustomButton
                icon={<FaTrash />}
                size="small"
              ></CustomButton>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.subtotalContainer}>
        <span className={styles.subtotalLabel}><FormattedMessage id="cart.subtotal"/></span>
        <span className={styles.subtotalValue}>10400 <FormattedMessage id="homepage.configurator.price.currencyLei"/></span>
      </div>
      <div className={styles.ctaButtonContainer}>
        <CustomButton icon="" size="medium" href="/checkout">
          <FormattedMessage id="homepage.button.finalizeOrder"/>
        </CustomButton>
      </div>
    </div>
  )
}
