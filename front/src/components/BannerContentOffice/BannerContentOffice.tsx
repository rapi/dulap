import classes from './BannerContentOffice.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
// import { FormattedMessage } from 'react-intl'
export const BannerContentOffice = () => {
  return (
    <div className={classes.heroContent}>
      <div className={classes.titleRow}>
        <p className={classes.heroTitle}>OFFICE TABLE</p>
        <CustomButton
          size="small"
          href="/configurator/office-table"
          variant="danger"
        >
          Try now
        </CustomButton>
      </div>
      <div className={classes.heroSubtitle}>
        The perfect place for your office, designed upon your needs
      </div>
    </div>
  )
}
