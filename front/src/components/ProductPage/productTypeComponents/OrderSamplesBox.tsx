import React from 'react'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { router } from 'next/client'
export const OrderSamplesBox = () => {
  return (
    <div className={styles.infoboxContainer}>
      <div className={styles.helpBoxTitle}>
        <p>
          <FormattedMessage id="orderSamplesBox.title" />
        </p>
      </div>
      <p className={styles.assemblyNote}>
        <FormattedMessage id="orderSamplesBox.p1" />
        <FormattedMessage
          id="orderSamplesBox.p2"
          defaultMessage="Vrei alte dimensiuni?"
        />
      </p>
      <CustomButton onClick={() => router.push('/product/samples')}>
        <FormattedMessage id="orderSamplesBox.btn" />
      </CustomButton>
    </div>
  )
}
