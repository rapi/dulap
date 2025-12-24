import classes from '../BannerContentOffice/BannerContentOffice.module.css'
import React from 'react'
import { FormattedMessage } from 'react-intl'
export const BannerStool = () => {
  return (
    <div className={classes.heroContent}>
      <div className={classes.titleRow}>
        <p className={classes.heroTitle}><FormattedMessage id="landing.stool.title"></FormattedMessage></p>
      </div>
      <div className={classes.heroSubtitle}>
        <FormattedMessage id="landing.stool.subtitle"></FormattedMessage>
      </div>
    </div>
  )
}
