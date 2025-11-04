import React, { FC } from 'react'
import SelectColor, {
  SelectColorItem,
} from '~/components/SelectColor/SelectColor'
import { getColorItemByName } from '~/utils/colorDictionary'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'

export type ProductGalleryColorsConfig = {
  // We reuse the same shape as ProductColors, but keep it separate to avoid type confusion
  type: 'galleryColors'
  colors: string[]
  selectedColor: string
  setSelectedColor: (value: string) => void
}

interface ProductGalleryColorsProps {
  configuration: ProductGalleryColorsConfig
  /** If present, render a read-only chip instead of an interactive selector */
  predefinedValue?: string
}

export const ProductGalleryColors: FC<ProductGalleryColorsProps> = ({
  configuration,
  predefinedValue,
}) => {
  // Read-only card if a predefined (forced) color is provided
  if (predefinedValue) {
    const ci = getColorItemByName(predefinedValue)

    return (
      <label className={styles.colorsLabel}>
        <p>
          <FormattedMessage id="homepage.configurator.colors.title" />
        </p>
        <SelectColorItem
          hexCode={ci?.hexCode}
          name={ci?.name}
          materialCode={ci?.materialCode}
          selected={true}
          size="medium"
        />
      </label>
    )
  }

  // Interactive (controlled) selector – independent from the main ProductColors
  return (
    <label className={styles.colorsLabel}>
      <SelectColor
        colors={configuration.colors}
        defaultSelected={configuration.selectedColor}
        onChange={(value) => configuration.setSelectedColor(value)}
        size="medium"
      />
    </label>
  )
}

export default ProductGalleryColors
