import classes from '../BannerContentOffice/BannerContentOffice.module.css'
import React from 'react'
import { FormattedMessage } from 'react-intl'
export const BannerTable = () => {
  return (
    <div className={classes.heroContent}>
      <div className={classes.titleRow}>
        <p className={classes.heroTitle}><FormattedMessage id="landing.table.title"></FormattedMessage></p>
       </div>
      <div className={classes.heroSubtitle}>
        <FormattedMessage id="landing.table.subtitle"></FormattedMessage>
      </div>
    </div>
  )
}
