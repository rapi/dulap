import styles from '../ProductPageLayout/ProductPageLayout.module.css'
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
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/ProductPrice'

export type ProductComponent =
  | ProductImageSelectComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductFurnitureComponent
  | ProductSectionsComponent
  | ProductPriceComponent

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
  const priceComponent = currentComponents.find(
    (component) => component.type === 'price'
  )
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
        {priceComponent && <ProductPrice configuration={priceComponent} />}
      </div>
    </>
  )
}
