import React from 'react'
import './Dulap.css'
import classes from './Dulap.module.css'
import { Banner } from '~/components/Banner/Banner'
import { FormattedMessage } from 'react-intl'
import { ProductTypesList } from '~/components/ProductTypesList/ProductTypesList'
import { ProductCatalog } from '~/components/ProductCatalog/ProductCatalog'
import { Gallery } from '~/components/Gallery/Gallery'
import { AboutUs } from '~/components/AboutUs/AboutUs'
import ContactBox from '~/components/ContactBox/ContactBox'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { InfoBar } from '~/components/InfoBar/InfoBar'
import { landingInfoBarContent } from '~/components/InfoBar/LandingInfoBarContent'

const galleryList = [
  { src: '/bedside/render/Biege 1.png', alt: 'Bedside render 1' },
  { src: '/bedside/render/Biege 2.png', alt: 'Bedside render 2' },
  {
    src: '/bedside/render/White 1.png',
    alt: 'Bedside render white 1',
  },
  {
    src: '/bedside/render/White 2.png',
    alt: 'Bedside render white 2',
  },
  { src: '/bedside/render/Grey 1.png', alt: 'Bedside render grey 1' },
  { src: '/bedside/render/Grey 2.png', alt: 'Bedside render grey 2' },
  { src: '/bedside/render/Biege 3.png', alt: 'Bedside render 3' },
  {
    src: '/bedside/render/White 3.png',
    alt: 'Bedside render white 3',
  },
]

export const Dulap: React.FC = () => {
  return (
    <div>
      <Banner
        // href={'/banner-wardrobe-2.png'}
        // mobileHref={'/banner-wardrobe-mobile.jpg'}
        href={'/bedside/render/Biege 1.png'}
        mobileHref={'/bedside/render/Biege 1.png'}
      />
      <section className={classes.infoBar}>
        <InfoBar items={landingInfoBarContent} />
      </section>
      <section className={classes.productTypes}>
        <h2 className={classes.productTypesTitle}>
          <FormattedMessage id="homepage.dulapLanding.title1" />
        </h2>
        <ProductTypesList></ProductTypesList>
      </section>
      <ContactBox
        title={<FormattedMessage id="contactBox.title" />}
        subtitle={<FormattedMessage id="contactBox.subtitle" />}
        showEmail={true}
        showTextarea={true}
        modalThankYouMessage="contactForm.modal.thankYouMessage"
      ></ContactBox>

      <section className={classes.readyProducts}>
        <h2 className={classes.readyProductsTitle}>
          <FormattedMessage id="homepage.dulapLanding.title2" />
        </h2>
        <ProductCatalog></ProductCatalog>
      </section>

      <section className={classes.gallery}>
        <h2 className={classes.galleryTitle}>
          <FormattedMessage id="homepage.dulapLanding.title3" />
        </h2>
        <Gallery images={galleryList} />
      </section>

      <section className={classes.aboutUs}>
        <AboutUs></AboutUs>
      </section>
      <ContactBox
        title={
          <span className={classes.contactBoxContainer}>
            <FormattedMessage id="contactBox.subscribe.title" />
            <FavoriteBorderIcon sx={{ fontSize: 22 }} />
          </span>
        }
        subtitle={<FormattedMessage id="contactBox.subscribe.subtitle" />}
        showEmail={true}
        modalThankYouMessage="contactForm.modal.subscribe.thankYouMessage"
      ></ContactBox>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  )
}
