import classes from './Banner.module.css'
import React from 'react'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIconMedium } from '~/components/Icons/Icons'
import Image from 'next/image'
import { FormattedMessage } from 'react-intl'
// import { useTranslation } from 'react-i18next'
export const Banner = () => {
  // const { t } = useTranslation()
  return (
    <section className={classes.hero}>
      <Image
        width={2056}
        height={1000}
        className={classes.heroImage}
        src="/banner-2.jpg"
        alt="Hero showcasing furniture"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
      />
      <div className={classes.heroContent}>
        <p className={classes.heroTitle}>
          <FormattedMessage id="homepage.banner.title.0" />
        </p>
        <p className={classes.heroTitle}>
          <FormattedMessage id="homepage.banner.title.1" />
        </p>
        <div className={classes.heroSubtitle}>
          <p>Mobilier creat după</p>
          <ol className={classes.subtitleAnimationList}>
            <li className={classes.subtitleAnimationListItem}>
              <span>dimensiunile</span>
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
        <CustomButton
          size="large"
          icon={<WardrobeIconMedium />}
          href="/products"
        >
          Încearcă aici
        </CustomButton>
      </div>
    </section>
  )
}
