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
  predefinedValue?: string
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
    <label className={styles.colorsLabel}>
      <p>
        <FormattedMessage id="homepage.configurator.colors.title" />
      </p>
      <SelectColorItem
        color={predefinedValue}
        selected={true}
        size={'medium'}
      />
    </label>
  ) : (
    <>
      <label className={styles.colorsLabel}>
        <p>
          <FormattedMessage id="homepage.configurator.colors.title" />
        </p>
        <SelectColor
          colors={colors}
          onChange={(value) => {
            setSelectedColor(value)
          }}
          defaultSelected={colors[1]}
          size="medium"
          showAdd
        />
      </label>
    </>
  )
}
