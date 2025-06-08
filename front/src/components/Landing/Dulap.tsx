import React from 'react'
import './Dulap.css'
import classes from './Dulap.module.css'
import { Banner } from '~/components/Banner/Banner'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage } from 'react-intl'
import { ProductTypesList } from '~/components/ProductTypesList/ProductTypesList'
import { ProductCatalog } from '~/components/ProductCatalog/ProductCatalog'
import { AboutUs } from '~/components/AboutUs/AboutUs'

export const Dulap: React.FC = () => {
  return (
    <div>
      <Banner
        href={'/banner-wardrobe-2.png'}
        mobileHref={'/banner-wardrobe-mobile.jpg'}
      />
      <section className={classes.productTypes}>
        <p className={classes.productTypesTitle}>
          <FormattedMessage id="homepage.dulapLanding.title1" />
        </p>
        <ProductTypesList></ProductTypesList>
      </section>

      <section className={classes.readyProducts}>
        <p className={classes.readyProductsTitle}>
          <FormattedMessage id="homepage.dulapLanding.title2" />
        </p>
        <ProductCatalog></ProductCatalog>
      </section>

      <section className={classes.aboutUs}>
        <AboutUs></AboutUs>
        <div className={classes.ctaButtonContainer}>
          <CustomButton icon="" size="large" variant="primary">
            Încearcă acum
          </CustomButton>
        </div>
      </section>
    </div>
  )
}
