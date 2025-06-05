import React, { FC } from 'react'
import SelectColor, {
  SelectColorItem,
} from '~/components/SelectColor/SelectColor'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
export type ProductColorsComponent = {
  type: 'colors'
  colors: string[]
  selectedColor: string
  setSelectedColor: (value: string) => void
}
interface ProductColorsProps {
  configuration: ProductColorsComponent
  predefinedValue?: string
}
export const ProductColors: FC<ProductColorsProps> = ({
  configuration: { colors, setSelectedColor },
  predefinedValue,
}) => {
  return predefinedValue ? (
    <SelectColorItem color={predefinedValue} selected={true} size={'medium'} />
  ) : (
    <>
      <label className={styles.colorsLabel}>
        <p><FormattedMessage id="homepage.configurator.colors.title" /></p>
        <SelectColor
          colors={colors}
          onChange={(value) => {
            setSelectedColor(value)
          }}
          defaultSelected={colors[0]}
          size="medium"
        />
      </label>
    </>
  )
}
