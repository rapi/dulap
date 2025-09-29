import React from 'react'
import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
import { FurnitureViewer } from './FurnitureViewer'
import { StandProductConfigurator } from '~/components/ProductPage/productTypes/stand'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/stand/ProductDimensions'
import {
  ProductColors,
} from '~/components/ProductPage/productTypeComponents/ProductColors'
import {
  ProductSections,
} from '~/components/ProductPage/productTypeComponents/stand/ProductSections'
import type { ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import {
  ProductFurniture,
} from '~/components/ProductPage/productTypeComponents/stand/ProductFurniture'
import {
  ProductPrice,
} from '~/components/ProductPage/productTypeComponents/ProductPrice'
import { ProductConfiguratorInfo } from '~/components/ProductPage/productTypeComponents/ProductConfiguratorInfo'
import { ProductInfobox } from '~/components/ProductPage/productTypeComponents/ProductInfobox'
import { ProductHelpBox } from '~/components/ProductPage/productTypeComponents/ProductHelpBox'
import { useCart } from '~/context/cartContext'
import { getColorItemByName } from '~/utils/colorDictionary'

export const ThreeDModel: React.FC = () => {
  const { addItem } = useCart()
  
  // Get the stand configurator components
  const components = StandProductConfigurator()
  
  // Find components by type
  const dimensionsComponent = components.find(c => c.type === 'dimensions')
  const colorsComponent = components.find(
    (c): c is { type: 'colors'; selectedColor: string } => c.type === 'colors'
  )
  const sectionsComponent = components.find(c => c.type === 'sections')
  const furnitureComponent = components.find(c => c.type === 'furniture')
  const priceComponent = components.find(c => c.type === 'price')
  
  // Current width from configurator
  const currentWidth = (dimensionsComponent as ProductDimensionsComponent | undefined)?.width ?? 80
  
  // Current height from configurator
  const currentHeight = (dimensionsComponent as ProductDimensionsComponent | undefined)?.height ?? 70
  
  // Current selected color mapped to HEX
  const selectedColorNameOrHex = colorsComponent?.selectedColor
  const selectedColorHex = selectedColorNameOrHex
    ? (getColorItemByName(selectedColorNameOrHex)?.hexCode ?? selectedColorNameOrHex)
    : '#ded9d3'

  return (
    <>
      {/* Left Side: 3D Model Viewer */}
      <div className={styles.leftContainer}>
        <FurnitureViewer key={selectedColorHex} width={currentWidth} selectedColor={selectedColorHex} height={currentHeight} />
      </div>

      {/* Right Side: Product Details - Same as Stand Configurator */}
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>
          <FormattedMessage id="threeDModel.title" />
        </h1>
        
        {dimensionsComponent && (
          <ProductDimensions
            configuration={dimensionsComponent}
            predefinedValue={undefined}
          />
        )}
        
        {colorsComponent && (
          <ProductColors
            configuration={colorsComponent}
            predefinedValue={undefined}
          />
        )}
        
                 {sectionsComponent && (
           <ProductSections
             configuration={sectionsComponent}
             predefinedValue={undefined}
             options={(sectionsComponent as { options?: ButtonOptionsType[] }).options}
           />
         )}
        
        {furnitureComponent && (
          <ProductFurniture
            configuration={furnitureComponent}
            predefinedValue={undefined}
          />
        )}
      </div>

      <div>
        {priceComponent && (
          <ProductPrice
            onAddItem={() => {
              addItem('stand', components, {})
            }}
            configuration={priceComponent}
            predefinedValue={undefined}
          />
        )}
        <ProductConfiguratorInfo linkConfigurator="/configurator/stand" />
        <ProductHelpBox />
        <ProductInfobox />
      </div>
    </>
  )
} 