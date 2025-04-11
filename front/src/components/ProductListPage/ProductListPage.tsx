import { useRouter } from "next/router";
import { productTypes } from '~/components/ProductListPage/productTypes'
import Image from 'next/image'
import styles from './ProductListPage.module.css'
import { CustomButton } from '../CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ProductList } from '../ProductList/ProductList'
import { ProductItem } from '../ProductItem/ProductItem'
import { WardrobeIconMedium } from '../Icons/Icons'

export const ProductListPage: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <div className={styles.productListContainer}>
        <h3 className={styles.title}>Alege tipul de mobilier, ca să începi personalizarea</h3>

        <div className={styles.productListSelectContainer}>
          {productTypes.map(({ image, link, name }) => (
            <div className={styles.productItemContainer} key={link}>
              <div
                onClick={() => router.push(link)} style={{ cursor: "pointer" }} 
                className={styles.imageContainer}
              >
                <Image
                  width={2056}
                  height={1000}
                  src={image}
                  alt={'dulap.md '+ name}
                  className={styles.productImage}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
                ></Image>
                <div className={styles.imageButton}>
                  <CustomButton
                    icon={<WardrobeIconMedium />}
                    variant='primary'
                    size='small'
                    // href={link}
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
