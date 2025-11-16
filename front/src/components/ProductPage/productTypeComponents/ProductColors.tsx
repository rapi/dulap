import React, { FC, useMemo, useEffect } from 'react'
import SelectColor, {
  SelectColorItem,
} from '~/components/SelectColor/SelectColor'
import { getColorItemByName } from '~/utils/colorDictionary'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ColorCTA from '~/components/ColorCTA/ColorCTA'
import { useMediaQuery } from '@mui/material'
import { use3DVersion } from '~/hooks/use3DVersion'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'

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

const FULL_PALETTE = [
  'White',
  'Biege',
  'Light Grey',
  'Grey',
  'Dark Grey',
  'Grey Cubanit',
  'Grey Stone',
  'Green Salvia',
  'Beige Sand',
  'Beige Cashmere',
  'Biege Almond',
  'Rose Antique',
  'Natural Acacia',
  'Natural Walnut',
] as const

function normHex(hex: string): string {
  const h = hex.startsWith('#') ? hex : `#${hex}`
  return h.toLowerCase()
}

function findNameByHex(
  hex: string,
  palette: readonly string[]
): string | undefined {
  const target = normHex(hex)
  for (const name of palette) {
    const item = getColorItemByName(name)
    if (item?.hexCode && normHex(item.hexCode) === target) return name
  }
  return undefined
}

export const ProductColors: FC<ProductColorsProps> = ({
  configuration,
  predefinedValue,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const is3DVersion = use3DVersion()
  const ctx = useConfiguratorConfigOptional()

  const palette = useMemo<readonly string[]>(
    () =>
      is3DVersion ? FULL_PALETTE : (configuration.colors as readonly string[]),
    [is3DVersion, configuration.colors]
  )

  const selectedColorName = useMemo<string>(() => {
    if (predefinedValue) return predefinedValue
    const byHex = ctx ? findNameByHex(ctx.config.color, palette) : undefined
    if (byHex) return byHex
    if (palette.includes(configuration.selectedColor))
      return configuration.selectedColor
    return (palette[0] as string) ?? ''
  }, [predefinedValue, ctx, palette, configuration.selectedColor])

  // Keep legacy per-page state in sync (so 3D reacts after refresh/deeplink)
  useEffect(() => {
    if (predefinedValue) return
    if (configuration.selectedColor !== selectedColorName) {
      configuration.setSelectedColor(selectedColorName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColorName, predefinedValue])

  const handleChange = (name: string) => {
    const item = getColorItemByName(name)
    if (!item?.hexCode) return
    // Update URL config with a full object (no functional updater)
    if (ctx) {
      ctx.setConfig({ ...ctx.config, color: normHex(item.hexCode) })
    }
    // Update legacy state used by 3D viewer
    configuration.setSelectedColor(name)
  }

  if (predefinedValue) {
    const ci = getColorItemByName(predefinedValue)
    return (
      <label className={styles.colorsLabel}>
        {!isMobile && (
          <div className={styles.colorsTitleLabel}>
            <p>
              <FormattedMessage id="homepage.configurator.colors.title" />
            </p>
          </div>
        )}
        <SelectColorItem
          hexCode={ci?.hexCode}
          name={ci?.name}
          materialCode={ci?.materialCode}
          selected
          size="medium"
        />
      </label>
    )
  }

  return (
    <label className={styles.colorsLabel}>
      {!isMobile && (
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
      )}

      <SelectColor
        colors={palette as string[]}
        value={selectedColorName} // controlled by URL/derived selection
        onChange={handleChange} // write URL + legacy state
        size="medium"
        showAdd={!is3DVersion}
        colorCTA={<ColorCTA trackingId="color_cta_configurator" />}
      />
    </label>
  )
}
