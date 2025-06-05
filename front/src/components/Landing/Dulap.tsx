import React from 'react'
import './Dulap.css'
import classes from './Dulap.module.css'
import { Banner } from '~/components/Banner/Banner'
import { ProductList } from '~/components/ProductList/ProductList'
import { ProductItem } from '~/components/ProductItem/ProductItem'
import { WardrobeSecondIcon } from '~/components/Icons/Icons'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { productTypes } from '~/components/ProductListPage/productTypes'
import { FormattedMessage } from 'react-intl'

export const Dulap: React.FC = () => {
  return (
    <div>
      <Banner />
      <section className={classes.productTypes}>
        <p className={classes.productTypesTitle}>
          <FormattedMessage id="homepage.dulapLanding.title1"/>
        </p>
        <ProductList>
          {productTypes.map(({ image, link, name }) => (
            <ProductItem
              image={image}
              name={name}
              key={link}
              link={link}
              button={
                <CustomButton
                  icon={<WardrobeSecondIcon />}
                  href={link}
                  outlined
                  size="medium"
                >
                  <FormattedMessage id="homepage.button.create"/>
                </CustomButton>
              }
            />
          ))}
        </ProductList>
      </section>

      <section className={classes.readyProducts}>
        <p className={classes.readyProductsTitle}>
          <FormattedMessage id="homepage.dulapLanding.title2"/>
        </p>
        <ProductList>
          {[...Array(6)].map((_, index) => (
            <ProductItem
              name={`products.comoda${index + 1}`}
              image={`/products/comoda-alba.jpg`}
              key={index}
              link=""
              button={
                <CustomButton
                  icon={<ShoppingCartIcon />}
                  outlined
                  size="medium"
                  variant="danger"
                >
                  <FormattedMessage id="homepage.button.addToCart"/>
                </CustomButton>
              }
            />
          ))}
        </ProductList>
      </section>

      <section className={classes.aboutUs}>
        <p className={classes.aboutUsTitle}><FormattedMessage id="homepage.dulapLanding.aboutUs.title"/></p>
        <div className={classes.aboutUsContent}>
          <img
            src="/banner.jpg"
            alt="Familia Grinciuc"
            className={classes.aboutImage}
          />
          <div className={classes.aboutUsDescription}>
            <p>
              <FormattedMessage id="homepage.dulapLanding.aboutUs.body.1"/>
              <br />
              <br />
              <FormattedMessage id="homepage.dulapLanding.aboutUs.body.2"/>
              <br />
              <br />
              <FormattedMessage id="homepage.dulapLanding.aboutUs.body.3"/>
              <br />
              <br />
              <FormattedMessage id="homepage.dulapLanding.aboutUs.body.4"/>
              <br />
              <br />
              <b><FormattedMessage id="homepage.dulapLanding.aboutUs.body.5"/></b>
            </p>
          </div>
        </div>
        <div className={classes.ctaButtonContainer}>
          <CustomButton icon="" size="large" variant="primary">
            Încearcă acum
          </CustomButton>
        </div>
      </section>
    </div>
  )
}
