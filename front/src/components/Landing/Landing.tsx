import React from 'react'
import './Landing.css'
import classes from './Landing.module.css'
import { Menu } from '~/components/Menu/Menu'
import { Banner } from '~/components/Banner/Banner'
import { ProductList } from '~/components/ProductList/ProductList'
import { ProductItem } from '~/components/ProductItem/ProductItem'
import { WardrobeSecondIcon } from '~/components/Icons/Icons'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
export const Landing: React.FC = () => {
  return (
    <div className="landing-page outfit-font">
      <Menu />
      <Banner />
      <section className={classes.productTypes}>
        <h3 className={classes.productTypesSubtitle}>
          Alege ce tip de dulap ai nevoie și începe personalizarea!
        </h3>
        <ProductList>
          {[...Array(6)].map((_, index) => (
            <ProductItem
              key={index}
              button={
                <CustomButton
                  icon={<WardrobeSecondIcon />}
                  outlined
                  size="medium"
                >
                  Creează
                </CustomButton>
              }
            />
          ))}
        </ProductList>
      </section>

      <section className={classes.readyProducts}>
        <h2>
          Alege <span>produse gata</span> din lista noastră
        </h2>
        <ProductList>
          {[...Array(6)].map((_, index) => (
            <ProductItem
              key={index}
              button={
                <CustomButton
                  icon={<ShoppingCartIcon />}
                  outlined
                  size="medium"
                >
                  Adaugă în coș
                </CustomButton>
              }
            />
          ))}
        </ProductList>
      </section>

      <section className={classes.aboutUs}>
        <div className="aboutContent">
          <img
            src="/banner.jpg"
            alt="Familia Grinciuc"
            className="aboutImage"
          />
          <div>
            <h2>Despre noi</h2>
            <p>
              dulap.md nu este doar un magazin de mobilier. Este povestea unei{' '}
              <span>familii...</span> Totul a început dintr-o nevoie simplă: să
              ne mobilăm casa simplu, clar și gust.
            </p>
            <button className="tryNowButton">Încearcă acum</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footerLinks">
          <a href="#">Dulapuri</a>
          <a href="#">Comode</a>
          <a href="#">Rafturi</a>
          <a href="#">Despre noi</a>
          <a href="#">Contacte</a>
        </div>
        <div className="socialLinks">
          <a href="#">
            <span className="iconInstagram" />
          </a>
          <a href="#">
            <span className="iconFacebook" />
          </a>
        </div>
        <p>Chișinău, Republica Moldova</p>
      </footer>
    </div>
  )
}
