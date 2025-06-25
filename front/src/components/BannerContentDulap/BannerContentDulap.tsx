import classes from './BannerContentDulap.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIconMedium } from '~/components/Icons/Icons'
import { FormattedMessage } from 'react-intl'
export const BannerContent = () => {
  return (
    <div className={classes.heroContent}>
      <div>
        <p className={classes.heroTitle}>
          <FormattedMessage
            id="homepage.banner.preorder.0"
            // id="homepage.banner.title.0"
            // defaultMessage="Dulapul tău -"
          />
        </p>
        <p className={classes.heroTitle}>
          {/* <FormattedMessage id="homepage.banner.title.1" /> */}
          <FormattedMessage id="homepage.banner.preorder.1" />
        </p>
      </div>

      <div className={classes.heroButtonContainer}>
        <CustomButton
          size="large"
          icon={<WardrobeIconMedium />}
          href="/products"
        >
          {/* <FormattedMessage id="homepage.button.tryIt" /> */}
          <FormattedMessage id="homepage.button.preorder" />
        </CustomButton>
      </div>

      <div>
        <p className={classes.heroComment}>
          <FormattedMessage id="homepage.banner.comment" />
        </p>
      </div>
    </div>
  )
}
