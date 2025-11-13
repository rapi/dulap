// pages/[locale]/configurator/[product].tsx
import type { GetServerSideProps } from 'next'
import { useMemo, useCallback } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'

import {
  PRODUCT_UI,
  isProductKey,
  type ProductKey,
} from '~/components/ProductPage/productTypes/registry'
import { UrlConfigProvider } from '~/context/urlConfigContext'
import { useUrlSync } from '~/utils/useUrlSync'
import {
  parseQueryToConfig,
  normalizeConfig,
  configToQuery,
  type ProductKey as PKey,
} from '~/utils/configUrl'
import type { BaseConfig, Constraints } from '~/utils/configTypes'
import { getConstraints } from '~/config/furnitureConstraints'

type Props = {
  locale: string
  product: ProductKey
  initialConfig: BaseConfig
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = String(ctx.params?.locale ?? 'ro')
  const productSlug = String(ctx.params?.product ?? '')
  if (!isProductKey(productSlug)) return { notFound: true }

  const C = getConstraints(productSlug) as Constraints
  const initial = normalizeConfig(
    parseQueryToConfig(
      ctx.query as Record<string, string | string[] | undefined>,
      productSlug as PKey,
      C
    ),
    productSlug as PKey,
    C
  )

  return {
    props: {
      locale,
      product: productSlug as ProductKey,
      initialConfig: initial,
    },
  }
}

export default function DynamicConfiguratorPage({
  locale,
  product,
  initialConfig,
}: Props) {
  const { Shell } = PRODUCT_UI[product]
  const C = useMemo<Constraints>(
    () => getConstraints(product) as Constraints,
    [product]
  )

  const toQuery = useCallback(
    (c: BaseConfig) => configToQuery(c, product as PKey, C),
    [product, C]
  )

  // useUrlSync manages a full BaseConfig; its setter is Dispatch<SetStateAction<BaseConfig>>
  const { config, setConfig: setBaseConfig } = useUrlSync<BaseConfig>(
    initialConfig,
    toQuery,
    `/${locale}/configurator/${product}`,
    250,
    // preserve feature flags/aux params
    ['use3DVersion', 'colCfg', 'doorSides']
  )

  /**
   * Adapter: expose a "partial merge" setter to the Provider, matching your context type:
   *   setConfig(next: Partial<BaseConfig> | ((prev: Partial<BaseConfig>) => Partial<BaseConfig>))
   * It merges into the current full BaseConfig before forwarding to setBaseConfig.
   */
  const setConfigMerged = useCallback(
    (
      next:
        | Partial<BaseConfig>
        | ((prev: Partial<BaseConfig>) => Partial<BaseConfig>)
    ) => {
      if (typeof next === 'function') {
        setBaseConfig((prev) => {
          const partial = next(prev)
          return { ...prev, ...partial }
        })
      } else {
        setBaseConfig((prev) => ({ ...prev, ...next }))
      }
    },
    [setBaseConfig]
  )

  return (
    <UrlConfigProvider
      value={{ config, setConfig: setConfigMerged, constraints: C }}
    >
      <ProductPageLayout>
        <Shell />
      </ProductPageLayout>
    </UrlConfigProvider>
  )
}
