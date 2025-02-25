import React from 'react'
import './Landing.css'
import classes from './Landing.module.css'
import { Banner } from '~/components/Banner/Banner'
import { ProductList } from '~/components/ProductList/ProductList'
import { ProductItem } from '~/components/ProductItem/ProductItem'
import { WardrobeSecondIcon } from '~/components/Icons/Icons'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { productTypes } from '~/components/ProductListPage/productTypes'

export const Landing: React.FC = () => {
  return (
    <div className="landing-page outfit-font">
      <Banner />
      <section className={classes.productTypes}>
        <p className={classes.productTypesTitle}>
          Alege ce tip de dulap ai nevoie și începe personalizarea!
        </p>
        <ProductList>
          {productTypes.map(({ image, link, name }) => (
            <ProductItem
              image={image}
              name={name}
              key={link}
              button={
                <CustomButton
                  icon={<WardrobeSecondIcon />}
                  href={link}
                  outlined
                  size="small"
                >
                  Creează
                </CustomButton>
              }
            />
          ))}
        </ProductList>
      </section>

      <section className={classes.readyProducts}>
        <p className={classes.readyProductsTitle}>
          Alege produse gata din lista noastră
        </p>
        <ProductList>
          {[...Array(6)].map((_, index) => (
            <ProductItem
              name={`Comodă ${index + 1}`}
              image={`/products/comoda-alba.jpg`}
              key={index}
              button={
                <CustomButton icon={<ShoppingCartIcon />} outlined size="small">
                  Adaugă în coș
                </CustomButton>
              }
            />
          ))}
        </ProductList>
      </section>

      <section className={classes.aboutUs}>
        <p className={classes.aboutUsTitle}>Despre noi</p>
        <div className={classes.aboutUsContent}>
          <img
            src="/banner.jpg"
            alt="Familia Grinciuc"
            className="aboutImage"
          />
          <div className={classes.aboutUsDescription}>
            <p>
              dulap.md nu este doar un magazin de mobilier. Este povestea unei
              familii - Elizabet, Vasile și cei doi băieți ai noștri – care au
              ales să transforme visurile și provocările într-un proiect plin de
              sens și emoție.
              <br />
              <br />
              Totul a început dintr-o nevoie simplă: să ne mobilăm casa simplu,
              dar cu gust. Nu am găsit ceea ce ne doream la preț accesibil, dar
              am găsit ceva și mai prețios: ideea de a crea noi înșine
              mobilierul perfect, și ideal customizabil.
              <br />
              <br />
              dulap.md este mai mult decât mobilier. Este o promisiune că orice
              casă poate deveni acasă.
              <br />
              <br />
              Mulțumim că ai ales să faci parte din povestea noastră!
            </p>
          </div>
        </div>
        <div className={classes.ctaButtonContainer}>
          <CustomButton icon="" outlined size="large" variant="danger">
            Încearcă acum
          </CustomButton>
        </div>
      </section>
    </div>
  )
}
