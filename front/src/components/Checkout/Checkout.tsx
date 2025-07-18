import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Checkout.module.css'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { grey } from '@mui/material/colors'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCart, CartItem } from '~/context/cartContext'
import { CustomButton } from '../CustomButton/CustomButton'
import { Modal } from '~/components/Modal/Modal'
import Select from '~/components//Select/Select'
import axios from 'axios'
const PROMO_CODES = [
  { code: 'PROMO10', discount: 10 },
  { code: 'PREORDER10', discount: 10 },
  { code: 'LAUNCH10', discount: 10 },
  { code: 'FAN15', discount: 15 },
  { code: 'BIRTHDAY20', discount: 20 },
]

export const Checkout: FC = () => {
  const router = useRouter()
  const intl = useIntl()
  const { items } = useCart()
  const { clearCart } = useCart()

  // form fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [comment, setComment] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [assemblyNeeded, setAssemblyNeeded] = useState<
    'checkout.assembly.yes' | 'checkout.assembly.no'
  >('checkout.assembly.no')

  // errors
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [cityError, setCityError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [promoError, setPromoError] = useState('')
  const [termsError, setTermsError] = useState('')
  const [commonError, setCommonError] = useState('')

  // other state
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // calculate totals
  const rawTotal = items.reduce((sum, { config }) => {
    let itemPrice = 0
    config.forEach((comp) => {
      if (comp.type === 'price') {
        itemPrice = comp.predefinedValue ?? comp.price
      }
    })
    return sum + itemPrice
  }, 0)
  const deliveryPrice = 0
  const discountAmount = Math.round((rawTotal * discountPercent) / 100)
  const assemblyCost =
    assemblyNeeded === 'checkout.assembly.yes' ? items.length * 350 : 0
  const totalToPay = rawTotal - discountAmount + deliveryPrice + assemblyCost

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError(
        intl.formatMessage({
          id: 'checkout.promo.required',
          defaultMessage: 'Introduceți codul promoțional',
        })
      )
      return
    }
    const entry = PROMO_CODES.find(
      (p) => p.code === promoCode.trim().toUpperCase()
    )
    if (entry) {
      setDiscountPercent(entry.discount)
      setPromoError('')
    } else {
      setDiscountPercent(0)
      setPromoError(
        intl.formatMessage({
          id: 'checkout.promo.invalid',
          defaultMessage: 'Eroare: cod invalid',
        })
      )
    }
  }

  const handlePlaceOrder = async () => {
    // reset errors
    setNameError('')
    setPhoneError('')
    setEmailError('')
    setCityError('')
    setAddressError('')
    setTermsError('')
    setCommonError('')

    // validate
    let valid = true
    if (!name.trim()) {
      setNameError(
        intl.formatMessage({
          id: 'checkout.error.required',
          defaultMessage: 'Acest câmp este obligatoriu',
        })
      )
      valid = false
    }
    if (!phone.trim()) {
      setPhoneError(
        intl.formatMessage({
          id: 'checkout.error.required',
          defaultMessage: 'Acest câmp este obligatoriu',
        })
      )
      valid = false
    }
    if (!email.trim()) {
      setEmailError(
        intl.formatMessage({
          id: 'checkout.error.required',
          defaultMessage: 'Acest câmp este obligatoriu',
        })
      )
      valid = false
    }
    if (!city.trim()) {
      setCityError(
        intl.formatMessage({
          id: 'checkout.error.required',
          defaultMessage: 'Acest câmp este obligatoriu',
        })
      )
      valid = false
    }
    if (!fullAddress.trim()) {
      setAddressError(
        intl.formatMessage({
          id: 'checkout.error.required',
          defaultMessage: 'Acest câmp este obligatoriu',
        })
      )
      valid = false
    }
    if (!termsAccepted) {
      setTermsError(
        intl.formatMessage({
          id: 'checkout.terms.required',
          defaultMessage: 'Trebuie să acceptați termenii și condițiile',
        })
      )
      valid = false
    }
    if (!valid) {
      setCommonError(
        intl.formatMessage({
          id: 'checkout.error.onSubmit',
          defaultMessage:
            'Completați toate câmpurile pentru a finaliza comanda.',
        })
      )
      return
    }
    await axios.post('/api/checkout', {
      items: JSON.stringify(items),
      name,
      phone,
      email,
      city,
      fullAddress,
      comment,
      assemblyCost,
      discountPercent,
      totalToPay,
    })
    setOrderPlaced(true)
    clearCart()
  }

  const handleCloseModal = () => {
    setOrderPlaced(false)
    router.push('/')
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <ShoppingBagIcon fontSize="large" sx={{ color: grey[800] }} />
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
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>
                  <FormattedMessage id="checkout.nameSurname" />
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={intl.formatMessage({
                    id: 'checkout.nameSurname',
                  })}
                />
                {nameError && <p className={styles.error}>{nameError}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>
                  <FormattedMessage id="checkout.phoneNumber" />
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={intl.formatMessage({
                    id: 'checkout.phoneNumber.placeholder',
                  })}
                />
                {phoneError && <p className={styles.error}>{phoneError}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>
                  <FormattedMessage id="checkout.email" />
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={intl.formatMessage({
                    id: 'checkout.email.placeholder',
                  })}
                />
                {emailError && <p className={styles.error}>{emailError}</p>}
              </div>
            </div>

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
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={intl.formatMessage({
                      id: 'checkout.city.placeholder',
                    })}
                  />
                  {cityError && <p className={styles.error}>{cityError}</p>}
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <FormattedMessage id="checkout.fullAddress" />
                  </label>
                  <input
                    type="text"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder={intl.formatMessage({
                      id: 'checkout.fullAddress.placeholder',
                    })}
                  />
                  {addressError && (
                    <p className={styles.error}>{addressError}</p>
                  )}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>
                  <FormattedMessage id="checkout.comment" />
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={intl.formatMessage({
                    id: 'checkout.comment.placeholder',
                  })}
                />
              </div>
            </div>

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
              {/* <label className={styles.paymentOption}>
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
              </label> */}
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              {items.map((item: CartItem, idx: number) => {
                let imageSrc = ''
                const dims = { width: 0, height: 0, depth: 0 }
                let itemPrice = 0
                item.config.forEach((comp) => {
                  switch (comp.type) {
                    case 'imageCarousel':
                      imageSrc = comp.predefinedValue ?? comp.images[0] ?? ''
                      break
                    case 'dimensions':
                      const d = comp.predefinedValue ?? {
                        width: comp.width,
                        height: comp.height,
                        depth: comp.depth,
                      }
                      dims.width = d.width
                      dims.height = d.height
                      dims.depth = d.depth
                      break
                    case 'price':
                      itemPrice = comp.predefinedValue ?? comp.price
                      break
                  }
                })
                const titleId =
                  item.name === 'wardrobe'
                    ? 'homepage.products.wardrobe'
                    : 'homepage.products.dulap'
                return (
                  <div className={styles.productItem} key={idx}>
                    <img
                      src={imageSrc}
                      alt={intl.formatMessage({ id: titleId })}
                      className={styles.productImage}
                    />
                    <div className={styles.productdetails}>
                      <p className={styles.productTitle}>
                        {intl.formatMessage({ id: titleId })}
                      </p>
                      <p className={styles.productSize}>
                        {dims.width} x {dims.height} x {dims.depth}{' '}
                        <FormattedMessage id="homepage.configurator.dimensions.cm" />
                      </p>
                      <p className={styles.productPrice}>
                        {itemPrice}{' '}
                        <FormattedMessage id="homepage.configurator.price.currencyLei" />
                      </p>
                    </div>
                  </div>
                )
              })}

              {/* Promo Code Section */}
              <div className={styles.promoSection}>
                <div className={styles.promoFirstRow}>
                  <label>
                    {intl.formatMessage({
                      id: 'checkout.promo.title',
                      defaultMessage: 'Ai un promocod?',
                    })}
                  </label>
                  <input
                    type="text"
                    placeholder={intl.formatMessage({
                      id: 'checkout.promo.placeholder',
                      defaultMessage: 'Introdu-l aici',
                    })}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={styles.promoInput}
                  />
                  <CustomButton
                    size="small"
                    variant="grey"
                    onClick={handleApplyPromo}
                  >
                    <FormattedMessage
                      id="checkout.promo.apply"
                      defaultMessage="Aplică"
                    />
                  </CustomButton>
                </div>
                <div className={styles.promoSecondRow}>
                  {promoError && (
                    <p className={styles.promoError}>{promoError}</p>
                  )}
                  {discountPercent > 0 && (
                    <p className={styles.promoSuccess}>
                      {intl.formatMessage({
                        id: 'checkout.promo.applied',
                        defaultMessage: 'Reducere: ',
                      })}
                      {discountPercent}%
                    </p>
                  )}
                </div>
              </div>

              {/* Assembly Section */}
              <div className={styles.assemblySection}>
                <div className={styles.assemblyFirstRow}>
                  <label>
                    <h4>
                      <FormattedMessage
                        id="checkout.assembly.title"
                        defaultMessage="Ai nevoie de asamblare?*"
                      />
                    </h4>
                  </label>
                  <Select
                    options={['checkout.assembly.yes', 'checkout.assembly.no']}
                    defaultValue={assemblyNeeded}
                    onChange={(value) =>
                      setAssemblyNeeded(
                        value as
                          | 'checkout.assembly.yes'
                          | 'checkout.assembly.no'
                      )
                    }
                    size="small"
                  />
                </div>
                <p className={styles.assemblyNote}>
                  <FormattedMessage
                    id="checkout.assembly.comment1"
                    defaultMessage="*Acest dulap nu are nevoie de asamblare profesionistă, iar pentru comoditate, oferim și o instrucțiune de asamblare."
                  />
                </p>
                <p className={styles.assemblyNote}>
                  <FormattedMessage
                    id="checkout.assembly.comment2"
                    defaultMessage="**Costul asamblării pentru fiecare produs este de 350 lei."
                  />
                </p>
              </div>

              {/* Totals */}
              <div className={styles.totalSection}>
                <p>
                  <FormattedMessage id="checkout.subtotal" />{' '}
                  <span>
                    {rawTotal}{' '}
                    <FormattedMessage id="homepage.configurator.price.currencyLei" />
                  </span>
                </p>
                {discountPercent > 0 && (
                  <p>
                    <FormattedMessage
                      id="checkout.discount"
                      defaultMessage="Reducere"
                    />{' '}
                    <span>
                      -{discountAmount}{' '}
                      <FormattedMessage id="homepage.configurator.price.currencyLei" />
                    </span>
                  </p>
                )}
                <p>
                  <FormattedMessage id="checkout.delivery" />{' '}
                  <span>
                    {deliveryPrice}{' '}
                    <FormattedMessage id="homepage.configurator.price.currencyLei" />
                  </span>
                </p>
                <p>
                  <FormattedMessage
                    id="checkout.assembly"
                    defaultMessage="Asamblare"
                  />{' '}
                  <span>
                    {assemblyCost}{' '}
                    <FormattedMessage id="homepage.configurator.price.currencyLei" />
                  </span>
                </p>
                <p className={styles.finalTotal}>
                  <FormattedMessage id="checkout.totalToPay" />{' '}
                  <span>
                    {totalToPay}{' '}
                    <FormattedMessage id="homepage.configurator.price.currencyLei" />
                  </span>
                </p>
              </div>

              {/* Terms & Place Order */}
              <div className={styles.termsSection}>
                <label className={styles.termsLabel}>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />{' '}
                  <span>
                    <FormattedMessage
                      id="checkout.terms.accept"
                      defaultMessage="Accept {link}"
                      values={{
                        link: (
                          <a
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FormattedMessage id="checkout.terms.termsAndConditions" />
                          </a>
                        ),
                      }}
                    />
                  </span>
                </label>
                {termsError && <p className={styles.error}>{termsError}</p>}
              </div>

              <div className={styles.placeOrderButtonContainer}>
                <CustomButton size="medium" onClick={handlePlaceOrder}>
                  <FormattedMessage id="homepage.button.placeOrder" />
                </CustomButton>
                <p className={styles.attentionMessage}>
                  <FormattedMessage id="checkout.message.attentionOrderDetails" />
                </p>
                <div>
                  {commonError && <p className={styles.error}>{commonError}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={orderPlaced} onClose={handleCloseModal}>
        <h3>
          <FormattedMessage
            id="checkout.modal.title"
            defaultMessage="Comanda plasată"
          />
        </h3>
        <p>
          <FormattedMessage
            id="checkout.modal.message"
            defaultMessage="Comanda ta a fost plasată, în scurt timp revenim cu un apel!"
          />
        </p>
        <div className={styles.buttonRow}>
          <CustomButton onClick={handleCloseModal}>
            <FormattedMessage id="homepage.button.ok" defaultMessage="OK" />
          </CustomButton>
        </div>
      </Modal>
    </>
  )
}
