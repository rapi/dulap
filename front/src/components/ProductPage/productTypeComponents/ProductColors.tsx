import React, { FC } from 'react'
import SelectColor, {
  SelectColorItem,
} from '~/components/SelectColor/SelectColor'
import { getColorItemByName } from '~/utils/colorDictionary'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
export type ProductColorsComponent = {
  type: 'colors'
  colors: string[]
  selectedColor: string
  predefinedValue?: string
  setSelectedColor: (value: string) => void
}
interface ProductColorsProps {
  configuration: ProductColorsComponent
  predefinedValue?: string
}
export const ProductColors: FC<ProductColorsProps> = ({
  configuration,
  predefinedValue,
}) => {
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
  return (
    <label className={styles.colorsLabel}>
      <p>
        <FormattedMessage id="homepage.configurator.colors.title" />
      </p>
      <SelectColor
        colors={configuration.colors}
        defaultSelected={configuration.selectedColor}
        onChange={(value) => configuration.setSelectedColor(value)}
        size="medium"
        showAdd
      />
    </label>
  )
}
