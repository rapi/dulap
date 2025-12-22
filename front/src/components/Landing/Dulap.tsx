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
import { InfoBar } from '~/components/InfoBar/InfoBar'
import { FAQ } from '~/components/FAQ/FAQ'
import { landingInfoBarContent } from '~/components/InfoBar/LandingInfoBarContent'
import BlogsList from '~/components/Blog/BlogsList'
import { FAQcontentLanding } from '~/components/FAQ/FAQcontentLanding'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'
import animationStyles from '~/styles/animations.module.css'
import ReviewsSection from '~/components/Reviews/ReviewsSection'

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
  const { ref: titleRef, isVisible: isTitleVisible } = useScrollAnimation({ 
    threshold: 0.3 
  })
  const { ref: catalogTitleRef, isVisible: isCatalogTitleVisible } = useScrollAnimation({ 
    threshold: 0.3 
  })

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
        <h2 
          ref={titleRef as React.RefObject<HTMLHeadingElement>}
          className={`${classes.productTypesTitle} ${isTitleVisible ? animationStyles.fadeInDown : ''}`}
        >
          <FormattedMessage id="homepage.dulapLanding.title1" />
        </h2>
        <ProductTypesList></ProductTypesList>
      </section>

      <section className={classes.readyProducts}>
        <h2 
          ref={catalogTitleRef as React.RefObject<HTMLHeadingElement>}
          className={`${classes.readyProductsTitle} ${isCatalogTitleVisible ? animationStyles.fadeInDown : ''}`}
        >
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
      <br />
      <br />
      <br />
      <section className={classes.reviews}>
        <h2 className={classes.galleryTitle}>
          <FormattedMessage id="homepage.dulapLanding.reviewsTitle" />
        </h2>
        <ReviewsSection></ReviewsSection>
      </section>
      <br />
      <br />
      <section className={classes.blog}>
        <h2 className={classes.galleryTitle}>
          <FormattedMessage id="homepage.dulapLanding.title4" />
        </h2>
        <div className={classes.blogList}>
          <BlogsList></BlogsList>
        </div>
      </section>
      <section className={classes.faq}>
        <FAQ content={FAQcontentLanding}></FAQ>
      </section>
      <section className={classes.aboutUs}>
        <AboutUs></AboutUs>
      </section>
      {/* <ContactBox
        title={
          <span className={classes.contactBoxContainer}>
            <FormattedMessage id="contactBox.subscribe.title" />
            <FavoriteBorderIcon sx={{ fontSize: 22 }} />
          </span>
        }
        subtitle={<FormattedMessage id="contactBox.subscribe.subtitle" />}
        showEmail={true}
        modalThankYouMessage="contactForm.modal.subscribe.thankYouMessage"
      ></ContactBox> */}
      <ContactBox
        title={<FormattedMessage id="contactBox.title" />}
        subtitle={<FormattedMessage id="contactBox.subtitle" />}
        showEmail={true}
        showTextarea={true}
        modalThankYouMessage="contactForm.modal.thankYouMessage"
      ></ContactBox>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  )
}
