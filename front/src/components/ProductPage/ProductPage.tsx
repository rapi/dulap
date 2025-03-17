import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import React, { FC } from 'react'
import {
  ProductImageSelect,
  ProductImageSelectComponent,
} from '~/components/ProductPage/productTypeComponents/ProductImageSelect'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductDimensions'
import {
  ProductColors,
  ProductColorsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductColors'
import {
  ProductSelect,
  ProductSelectComponent,
} from '~/components/ProductPage/productTypeComponents/ProductSelect'
import {
  ProductFurniture,
  ProductFurnitureComponent,
} from '~/components/ProductPage/productTypeComponents/ProductFurniture'
import {
  ProductSections,
  ProductSectionsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductSections'
import { Carousel } from '~/components/Carousel/Carousel'

export type ProductComponent =
  | ProductImageSelectComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductFurnitureComponent
  | ProductSectionsComponent

interface ProductPageProps {
  components: () => ProductComponent[]
  name: string
  images: string[]
}

export const ProductPage: FC<ProductPageProps> = ({
  components,
  name,
  images,
}) => {
  const getComponent = (component: ProductComponent): React.ReactNode => {
    switch (component.type) {
      case 'imageSelect':
        return <ProductImageSelect configuration={component} />
      case 'dimensions':
        return <ProductDimensions configuration={component} />
      case 'colors':
        return <ProductColors configuration={component} />
      case 'select':
        return <ProductSelect configuration={component} />
      case 'furniture':
        return <ProductFurniture configuration={component} />
      case 'sections':
        return <ProductSections configuration={component} />
    }
  }
  const currentComponents = components()
  return (
    <>
      {/* Left Side: Image */}
      <div className={styles.imageContainer}>
        <Carousel
          width={600}
          images={images.map((image) => ({ src: image, alt: image }))}
        />
      </div>

      {/* Right Side: Product Details */}
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>{name}</h1>
        {currentComponents.map((component, index) => {
          return (
            <div key={index + component.type}>{getComponent(component)}</div>
          )
        })}
      </div>
      <div>
        <div className={styles.priceContainer}>
          <div className={styles.priceTitle}>
            <h4>Calculator de preț:</h4>
          </div>
          <div className={styles.price}>
            <h2>6850 MDL</h2>
          </div>
          <div className={styles.addToCartButtonContainer}>
            <CustomButton
              icon={<ShoppingCartIcon />}
              size="large"
              variant="danger"
            >
              Adaugă în coș
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  )
}
