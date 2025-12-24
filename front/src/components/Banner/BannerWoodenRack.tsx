import classes from '../BannerContentOffice/BannerContentOffice.module.css'
import React from 'react'
import { FormattedMessage } from 'react-intl'
export const BannerWoodenRack = () => {
  return (
    <div className={classes.heroContentWoodenRack}>
      <div className={classes.titleRow}>
        <p className={classes.heroTitle}><FormattedMessage id="landing.woodenRack.title"></FormattedMessage></p>
      </div>
      <div className={classes.heroSubtitle}>
        <FormattedMessage id="landing.woodenRack.subtitle"></FormattedMessage>
      </div>
    </div>
  )
}
