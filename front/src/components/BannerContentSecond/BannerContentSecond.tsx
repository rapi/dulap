import classes from './BannerContentSecond.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
// import { FormattedMessage } from 'react-intl'
export const BannerContentOffice = () => {
  return (
    <div className={classes.heroContent}>
      <p className={classes.heroTitle}>Greenwall</p>
      <div className={classes.heroSubtitle}>
        Modular phytowall that brings a breath of nature into modern interiors
      </div>
      <CustomButton
        size="medium"
        href="/configurator/greenwall"
        variant="danger"
      >
        Try now
      </CustomButton>
    </div>
  )
}
