import React, { FC } from 'react'
import SelectColor, {
  SelectColorItem,
} from '~/components/SelectColor/SelectColor'
import { getColorItemByName } from '~/utils/colorDictionary'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ColorCTA from '~/components/ColorCTA/ColorCTA'
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
      <div className={styles.colorsTitleLabel}>
        <h3 className={styles.dimensionsHeaderTitle}>
          <FormattedMessage id="homepage.configurator.colors.title" />
        </h3>
        <Link
          href="/blog/colors"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.dimensionsTooltipContainer}
          title="Cum să alegi corect culoarea?"
          aria-describedby="dims-tooltip"
          aria-label="Cum să alegi corect culoarea?"
        >
          <HelpOutlineIcon color="action" sx={{ fontSize: 20 }} />
          <span id="dims-tooltip" className={styles.dimensionsTooltipText}>
            <FormattedMessage id="colors.title.tooltip" />
          </span>
        </Link>
      </div>
      <SelectColor
        colors={configuration.colors}
        defaultSelected={configuration.selectedColor}
        onChange={(value) => configuration.setSelectedColor(value)}
        size="medium"
        showAdd
        colorCTA={<ColorCTA trackingId="color_cta_configurator" />}
      />
    </label>
  )
}
