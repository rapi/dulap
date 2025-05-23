import classes from './BannerContentOffice.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
// import { FormattedMessage } from 'react-intl'
export const BannerContentOffice = () => {
  return (
    <div className={classes.heroContent}>
      <p className={classes.heroTitle}>Office table</p>
      <div className={classes.heroSubtitle}>
        The perfect place for your office, designed upon your needs
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
