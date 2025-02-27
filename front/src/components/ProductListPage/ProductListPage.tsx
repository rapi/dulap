import { productTypes } from '~/components/ProductListPage/productTypes'
import Image from 'next/image'
import styles from './ProductListPage.module.css'
import { CustomButton } from '../CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ProductList } from '../ProductList/ProductList'
import { ProductItem } from '../ProductItem/ProductItem'
import { WardrobeIconMedium } from '../Icons/Icons'
// import { amber } from '@mui/material/colors';
// import ExtensionIcon from '@mui/icons-material/Extension';

export const ProductListPage: React.FC = () => {
  return (
    <>
      <div className={styles.productListContainer}>
        <h3 className={styles.title}>Alege tipul de mobilier, ca să începi personalizarea</h3>

        <div className={styles.productListSelectContainer}>
          {productTypes.map(({ image, link, name }) => (
            <div className={styles.productItemContainer} key={link}>
              <div className={styles.imageContainer}>
                <Image
                  width={2056}
                  height={1000}
                  src={image}
                  alt={'dulap.md '+ name}
                  className={styles.productImage}
                ></Image>
                <div className={styles.imageButton}>
                  <CustomButton
                    icon={<WardrobeIconMedium />}
                    variant='primary'
                    size='small'
                    href={link}
                  >Creează</CustomButton>
                </div>
              </div>
              <div className={styles.productTypeTitle}>{name}</div>
            </div>
          ))}
        </div>

        <p className={styles.title}>
          SAU<br></br>
          <br></br>
          Alege produse gata din lista noastră
        </p>

        <section className={styles.readyProducts}>
          <ProductList>
            {[...Array(6)].map((_, index) => (
              <ProductItem
                name={`Comodă ${index + 1}`}
                image={`/products/comoda-alba.jpg`}
                key={index}
                link=''
                button={
                  <CustomButton 
                    icon={<ShoppingCartIcon />} 
                    outlined size="medium" 
                    variant="danger"
                  >
                    Adaugă în coș
                  </CustomButton>
                }
              />
            ))}
          </ProductList>
        </section>
      </div>
    </>
  )
}
