import classes from './BannerContentDulap.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIconMedium } from '~/components/Icons/Icons'
import { FormattedMessage } from 'react-intl'
export const BannerContent = () => {
  return (
    <div className={classes.heroContent}>
      <div>
        <h1 className={classes.visuallyHiddenHeader}>
          <FormattedMessage
            id="homepage.banner.header.hidden"
          />
        </h1>
        <h2 className={classes.heroHeader}>
          <FormattedMessage
            id="homepage.banner.header.0"
          />
        </h2>
      </div>
      <div>
        <h2 className={classes.heroTitle}>
          <FormattedMessage
            id="homepage.banner.preorder.0"
          />
        </h2>
        <h2 className={classes.heroTitle}>
          <FormattedMessage id="homepage.banner.preorder.1" />
        </h2>
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

      {/*<div>*/}
      {/*  <p className={classes.heroComment}>*/}
      {/*    <FormattedMessage id="homepage.banner.comment" />*/}
      {/*  </p>*/}
      {/*</div>*/}
    </div>
  )
}
