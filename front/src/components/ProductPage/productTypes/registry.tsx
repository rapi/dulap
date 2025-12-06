// components/ProductPage/productTypes/registry.tsx
import type { ComponentType, FC } from 'react'

export type ProductKey = 'stand' | 'wardrobe' | 'tv-stand' | 'bedside' | 'bookcase'

/** No props needed right now; keeps it strictly typed and uniform */
type ShellProps = Record<string, never>

export interface ProductUiEntry {
  titleKey: string
  Shell: ComponentType<ShellProps>
}

/* ---- Bedside ---- */
import { ProductPage as BedsideProductPage } from '~/components/ProductPage/BedsideProductPage'
import { BedsideProductConfigurator } from '~/components/ProductPage/productTypes/bedside'

const BedsideShell: FC<ShellProps> = () => (
  <BedsideProductPage
    components={BedsideProductConfigurator}
    name="homepage.configurator.bedside.title"
  />
)

/* ---- Stand ---- */
import { ProductPage as StandProductPage } from '~/components/ProductPage/StandProductPage'
import { StandProductConfigurator } from '~/components/ProductPage/productTypes/stand'

const StandShell: FC<ShellProps> = () => (
  <StandProductPage
    components={StandProductConfigurator}
    name="homepage.configurator.stand.title"
  />
)

/* ---- Wardrobe ---- */
import { ProductPage as WardrobeProductPage } from '~/components/ProductPage/WardrobeProductPage'
import { WardrobeProductConfigurator } from '~/components/ProductPage/productTypes/wardrobe'

const WardrobeShell: FC<ShellProps> = () => (
  <WardrobeProductPage
    components={WardrobeProductConfigurator}
    name="homepage.configurator.wardrobe.title"
  />
)

/* ---- TV-stand ---- */
import { ProductPage as TVStandProductPage } from '~/components/ProductPage/TVStandProductPage'
import { TVStandProductConfigurator } from '~/components/ProductPage/productTypes/TVstand'

const TVStandShell: FC<ShellProps> = () => (
  <TVStandProductPage
    components={TVStandProductConfigurator}
    name="homepage.configurator.tv-stand.title"
  />
)

/* ---- Bookcase ---- */
import { ProductPage as BookcaseProductPage } from '~/components/ProductPage/BookcaseProductPage'
import { BookcaseProductConfigurator } from '~/components/ProductPage/productTypes/bookcase'

const BookcaseShell: FC<ShellProps> = () => (
  <BookcaseProductPage
    components={BookcaseProductConfigurator}
    name="homepage.configurator.bookcase.title"
  />
)

export const PRODUCT_UI: Record<ProductKey, ProductUiEntry> = {
  bedside: {
    titleKey: 'homepage.configurator.bedside.title',
    Shell: BedsideShell,
  },
  stand: { titleKey: 'homepage.configurator.stand.title', Shell: StandShell },
  wardrobe: {
    titleKey: 'homepage.configurator.wardrobe.title',
    Shell: WardrobeShell,
  },
  'tv-stand': {
    titleKey: 'homepage.configurator.tvstand.title',
    Shell: TVStandShell,
  },
  bookcase: {
    titleKey: 'homepage.configurator.bookcase.title',
    Shell: BookcaseShell,
  },
}

export const isProductKey = (v: string): v is ProductKey =>
  (['stand', 'wardrobe', 'tv-stand', 'bedside', 'bookcase'] as const).includes(
    v as ProductKey
  )
