import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC } from 'react'
import {
  ProductImageSelect,
  ProductImageSelectComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductImageSelect'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductDimensions'
import {
  ProductColors,
  ProductColorsComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductColors'
import {
  ProductSelect,
  ProductSelectComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductSelect'
import {
  ProductFurniture,
  ProductFurnitureComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductFurniture'
import {
  ProductSections,
  ProductSectionsComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductSections'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductPrice'
import {
  ProductImageCarousel,
  ProductImageCarouselComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductImageCarousel'

export type ProductComponent =
  | ProductImageSelectComponent
  | ProductImageCarouselComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductFurnitureComponent
  | ProductSectionsComponent
  | ProductPriceComponent

interface ProductPageProps {
  components: () => ProductComponent[]
  name: string
}

export const ProductPage: FC<ProductPageProps> = ({ components, name }) => {
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
        <h1 className={styles.title}>{name}</h1>
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
