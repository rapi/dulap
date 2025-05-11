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

export const Dulap: React.FC = () => {
  return (
    <div>
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
              link={link}
              button={
                <CustomButton
                  icon={<WardrobeSecondIcon />}
                  href={link}
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
        <p className={classes.readyProductsTitle}>
          Alege produse gata din lista noastră
        </p>
        <ProductList>
          {[...Array(6)].map((_, index) => (
            <ProductItem
              name={`Comodă ${index + 1}`}
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
            className={classes.aboutImage}
          />
          <div className={classes.aboutUsDescription}>
            <p>
              La dulap.md facem mobilier personalizat, la prețuri corecte.
              Simplu.
              <br />
              <br />
              Suntem o afacere de familie din Moldova, cu o echipă mică, dar
              serioasă. Ne concentrăm pe un singur lucru: să construim dulapuri
              care arată bine, țin mult și se potrivesc perfect în spațiul tău.
              <br />
              <br />
              Lucrăm cu materiale de calitate, meșteri pricepuți și furnizori în
              care avem încredere. Nu vindem promisiuni, ci produse durabile,
              făcute cu grijă și atenție la detalii.
              <br />
              <br />
              Suntem la început, dar punem suflet în fiecare proiect. Pentru
              noi, fiecare client contează.
              <br />
              <br />
              <b>dulap.md – fiecare spațiu merită un dulap bun.</b>
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
