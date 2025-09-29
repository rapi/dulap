import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC } from 'react'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/greenwall/ProductDimensions'
import {
  ProductColors,
  ProductColorsComponent,
} from '~/components/ProductPage/productTypeComponents/greenwall/ProductColors'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/greenwall/ProductPrice'
import {
  ProductImageCarousel,
  ProductImageCarouselComponent,
} from '~/components/ProductPage/productTypeComponents/greenwall/ProductImageCarousel'
import {
  ProductOptions,
  ProductOptionsComponent,
} from '~/components/ProductPage/productTypeComponents/greenwall/ProductOptions'

export type ProductComponent =
  | ProductImageCarouselComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductPriceComponent
  | ProductOptionsComponent

interface ProductPageProps {
  components: () => ProductComponent[]
  name: string
}

export const ProductPage: FC<ProductPageProps> = ({ components, name }) => {
  const getComponent = (component: ProductComponent): React.ReactNode => {
    switch (component.type) {
      case 'dimensions':
        return <ProductDimensions configuration={component} />
      case 'colors':
        return <ProductColors configuration={component} />
      case 'options':
        return <ProductOptions configuration={component} />
    }
  }

  const currentComponents = components()
  const priceComponent = currentComponents.find(
    (component) => component.type === 'price'
  )
  const imageCarouselComponent = currentComponents.find(
    (component) => component.type === 'imageCarousel'
  )
  return (
    <>
      {/* Left Side: Image */}
      <div className={styles.leftContainer}>
        {imageCarouselComponent && (
          <ProductImageCarousel configuration={imageCarouselComponent} />
        )}
      </div>
      {/* Right Side: Product Details */}
      <div className={styles.detailsContainer}>
        <h3 className={styles.title}>{name}</h3>
        {currentComponents.map((component, index) => {
          return (
            <div key={index + component.type}>{getComponent(component)}</div>
          )
        })}
      </div>
      <div>
        {priceComponent && <ProductPrice configuration={priceComponent} />}
      </div>
    </>
  )
}
