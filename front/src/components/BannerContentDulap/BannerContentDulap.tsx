import classes from './BannerContentDulap.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { FormattedMessage } from 'react-intl'
import animationStyles from '~/styles/animations.module.css'

export const BannerContent = () => {
  return (
    <div className={classes.heroContent}>
      <div className={animationStyles.fadeInUp} style={{ animationDelay: '0.2s' }}>
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
      <div className={animationStyles.fadeInUp} style={{ animationDelay: '0.4s' }}>
        <h2 className={classes.heroTitle}>
          <FormattedMessage
            id="homepage.banner.preorder.0"
          />
        </h2>
        <h2 className={classes.heroTitle}>
          <FormattedMessage id="homepage.banner.preorder.1" />
        </h2>
      </div>

      <div className={`${classes.heroButtonContainer} ${animationStyles.fadeInUp}`} style={{ animationDelay: '0.6s' }}>
        <CustomButton
          size="large"
          icon={<AutoFixHighIcon sx={{ color: 'white' }} />}
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
