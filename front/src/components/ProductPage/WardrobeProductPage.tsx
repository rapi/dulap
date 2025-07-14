import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
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
} from '~/components/ProductPage/productTypeComponents/ProductColors'
import {
  ProductSelect,
  ProductSelectComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductSelect'
import {
  ProductFurniture,
  ProductFurnitureComponent,
  ProductFurniturePredefinedValue,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductFurniture'
import {
  ProductSectionPredefinedValue,
  ProductSections,
  ProductSectionsComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductSections'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductPrice'
import { ProductInfobox } from '~/components/ProductPage/productTypeComponents/ProductInfobox'
import { ProductConfiguratorInfo } from '~/components/ProductPage/productTypeComponents/ProductConfiguratorInfo'
import {
  ProductImageCarousel,
  ProductImageCarouselComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductImageCarousel'
import { FormattedMessage } from 'react-intl'
import { useCart } from '~/context/cartContext'
import { Dimension } from '../ProductListPage/products'

export type ProductComponent =
  | ProductImageSelectComponent
  | ProductImageCarouselComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductSectionsComponent
  | ProductFurnitureComponent
  | ProductPriceComponent
export type PredefinedValue = {
  sections?: ProductSectionPredefinedValue
  imageSelect?: string
  imageCarousel?: string[]
  dimensions?: Dimension
  colors?: string
  select?: string
  furniture?: ProductFurniturePredefinedValue
  price?: number
}
interface ProductPageProps {
  components: () => ProductComponent[]
  name: string
  values?: PredefinedValue
}

export const ProductPage: FC<ProductPageProps> = ({
  components,
  name,
  values,
}) => {
  const { addItem } = useCart()
  const getComponent = (component: ProductComponent): React.ReactNode => {
    switch (component.type) {
      case 'imageSelect':
        return (
          <ProductImageSelect
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'dimensions':
        return (
          <ProductDimensions
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'colors':
        return (
          <ProductColors
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'select':
        return (
          <ProductSelect
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'sections':
        return (
          <ProductSections
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'furniture':
        return (
          <ProductFurniture
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
    }
  }

  const currentComponents = components()
  const priceComponent = currentComponents.find(
    (component) => component.type === 'price'
  )
  const imageCarouselComponent = currentComponents.find(
    (component) => component.type === 'imageCarousel'
  )
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const router = useRouter()
  const route =
    router.pathname.match(/^\/[^/]+\/product(\/.+?)\/[^/]+$/)?.[1] ?? ''
  const configuratorRoute = '/configurator' + route

  return (
    <>
      {/* Left Side: Image */}
      <div className={styles.leftContainer}>
        {imageCarouselComponent && (
          <ProductImageCarousel
            configuration={
              values?.imageCarousel
                ? {
                    type: 'imageCarousel',
                    images: values.imageCarousel,
                  }
                : imageCarouselComponent
            }
          />
        )}
      </div>
      {/* Right Side: Product Details */}
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>
          <FormattedMessage id={name} />
        </h1>
        {currentComponents.map((component, index) => {
          return (
            <div key={index + component.type}>{getComponent(component)}</div>
          )
        })}
      </div>
      <div>
        {priceComponent && (
          <ProductPrice
            onAddItem={() => {
              addItem('wardrobe', currentComponents, values ?? {})
            }}
            configuration={priceComponent}
            predefinedValue={values?.price ?? undefined}
          />
        )}
        {values != null && (
          <ProductConfiguratorInfo linkConfigurator={configuratorRoute} />
        )}
        <ProductInfobox />
      </div>
    </>
  )
}
