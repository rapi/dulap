import classes from './BannerContentDulap.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIconMedium } from '~/components/Icons/Icons'
import { FormattedMessage } from 'react-intl'
export const BannerContent = () => {
  return (
    <div className={classes.heroContent}>
      <p className={classes.heroTitle}>
        <FormattedMessage
          id="homepage.banner.title.0"
          defaultMessage="Dulapul tău -"
        />
      </p>
      <p className={classes.heroTitle}>
        <FormattedMessage id="homepage.banner.title.1" />
      </p>
      <div className={classes.heroSubtitle}>
        <p>
          <FormattedMessage id="homepage.banner.subtitle" />
        </p>
        <ol className={classes.subtitleAnimationList}>
          <li className={classes.subtitleAnimationListItem}>
            <span>
              <FormattedMessage id="homepage.banner.subtitle.1" />
            </span>
          </li>
          <li className={classes.subtitleAnimationListItem}>
            <span>preferințele</span>
          </li>
          <li className={classes.subtitleAnimationListItem}>
            <span>culorile</span>
          </li>
          <li className={classes.subtitleAnimationListItem}>
            <span>gusturile</span>
          </li>
        </ol>
        <p>tale</p>
      </div>
      <CustomButton size="large" icon={<WardrobeIconMedium />} href="/products">
        Încearcă aici
      </CustomButton>
    </div>
  )
}
