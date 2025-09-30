import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC } from 'react'
import { useEffect } from 'react'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/stand/ProductDimensions'
import {
  ProductColors,
  ProductColorsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductColors'
import {
  ProductSelect,
  ProductSelectComponent,
} from '~/components/ProductPage/productTypeComponents/ProductSelect'
import {
  ProductSections,
  ProductSectionsComponent,
} from '~/components/ProductPage/productTypeComponents/stand/ProductSections'
import type { ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import {
  ProductFurniture,
  ProductFurnitureComponent,
  ProductFurniturePredefinedValue,
} from '~/components/ProductPage/productTypeComponents/stand/ProductFurniture'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/ProductPrice'
import { ProductConfiguratorInfo } from '~/components/ProductPage/productTypeComponents/ProductConfiguratorInfo'
import { ProductInfobox } from '~/components/ProductPage/productTypeComponents/ProductInfobox'
import { ProductHelpBox } from '~/components/ProductPage/productTypeComponents/ProductHelpBox'
import {
  ProductImageCarousel,
  ProductImageCarouselComponent,
} from '~/components/ProductPage/productTypeComponents/stand/ProductImageCarousel'
import { FurnitureViewer } from '~/components/ThreeDModel/FurnitureViewer'
import { use3DVersion } from '~/hooks/use3DVersion'
import { FormattedMessage } from 'react-intl'
import { useCart } from '~/context/cartContext'
import { Dimension } from '../ProductListPage/products'
import { useRouter } from 'next/router'
import { getColorItemByName } from '~/utils/colorDictionary'
import { DEFAULT_STAND } from './productTypes/stand'

export type ProductComponent =
  | ProductImageCarouselComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductSectionsComponent
  | ProductFurnitureComponent
  | ProductPriceComponent

export type PredefinedValue = {
  sections?: number
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
      case 'sections':
        const compWithOpts = component as ProductSectionsComponent & {
          options?: ButtonOptionsType[]
        }
        return (
          <ProductSections
            configuration={compWithOpts}
            predefinedValue={values?.[component.type] ?? undefined}
            options={compWithOpts.options}
          />
        )
      case 'select':
        return (
          <ProductSelect
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

  const isStand3D = use3DVersion()

  // Extract current selected color (map names to HEX for 3D)
  const colorsComponent = currentComponents.find(
    (c): c is ProductColorsComponent => c.type === 'colors'
  )
  const selectedColorNameOrHex =
    colorsComponent?.selectedColor ?? DEFAULT_STAND.selectedColor
  const selectedColorHex =
    getColorItemByName(selectedColorNameOrHex)?.hexCode ??
    selectedColorNameOrHex

  // Extract current width & height for 3D scaling
  const dimensionsComponent = currentComponents.find(
    (c): c is ProductDimensionsComponent => c.type === 'dimensions'
  )
  const currentWidth = dimensionsComponent?.width ?? DEFAULT_STAND.width
  const currentHeight = dimensionsComponent?.height ?? DEFAULT_STAND.height
  const currentDepth = dimensionsComponent?.depth ?? DEFAULT_STAND.depth
  const currentPlintHeight =
    dimensionsComponent?.plintHeight ?? DEFAULT_STAND.plintHeight

  return (
    <>
      {/* Left Side: Viewer or Image Carousel */}
      <div className={styles.leftContainer}>
        {isStand3D ? (
          <FurnitureViewer
            selectedColor={selectedColorHex}
            width={currentWidth}
            height={currentHeight}
            depth={currentDepth}
            currentPlintHeight={currentPlintHeight}
          />
        ) : (
          imageCarouselComponent && (
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
          )
        )}
      </div>
      {/* Right Side: Product Details */}
      <div className={styles.detailsContainer}>
        <h3 className={styles.title}>
          <FormattedMessage id={name} />
        </h3>
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
              addItem('stand', currentComponents, values ?? {})
            }}
            configuration={priceComponent}
            predefinedValue={values?.price ?? undefined}
          />
        )}
        {values != null && (
          <ProductConfiguratorInfo linkConfigurator={configuratorRoute} />
        )}
        {/* Hiding it for now, have to fix the styles */}
        {!isStand3D && 
        <><ProductHelpBox /><ProductInfobox /></>
        }
      </div>
    </>
  )
}
