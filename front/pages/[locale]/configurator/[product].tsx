// pages/[locale]/configurator/[product].tsx
import type { GetServerSideProps } from 'next'
import { useMemo, useCallback, useEffect, useRef } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { useRouter } from 'next/router'

import {
  PRODUCT_UI,
  isProductKey,
  type ProductKey,
} from '~/components/ProductPage/productTypes/registry'
import { UrlConfigProvider } from '~/context/urlConfigContext'
import { useUrlRead } from '~/utils/useUrlSync'
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
  product,
  initialConfig,
}: Props) {
  const router = useRouter()
  const { Shell } = PRODUCT_UI[product]
  const C = useMemo<Constraints>(
    () => getConstraints(product) as Constraints,
    [product]
  )

  // Use read-only URL hook - no auto-sync to URL
  // URL params are only used for initial config loading
  const { config, setConfig: setBaseConfig } =
    useUrlRead<BaseConfig>(initialConfig)

  // Track previous config for URL sync
  const prevConfigRef = useRef<BaseConfig>(initialConfig)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync config changes to URL (debounced)
  useEffect(() => {
    if (!router.isReady) return

    // Clear any pending sync
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current)
    }

    // Debounce URL updates to avoid excessive history entries
    syncTimerRef.current = setTimeout(() => {
      const queryParams = configToQuery(config, product, C)

      // Only update URL if config actually changed
      const configChanged =
        JSON.stringify(config) !== JSON.stringify(prevConfigRef.current)
      if (configChanged) {
        prevConfigRef.current = config

        // Get current locale from router query
        const currentLocale = router.query.locale || 'ro'

        router.replace(
          {
            pathname: `/${currentLocale}/configurator/${product}`,
            query: queryParams,
          },
          undefined,
          { shallow: true, scroll: false }
        )
      }
    }, 300) // 300ms debounce

    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current)
      }
    }
  }, [config, router, product, C])

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
        setBaseConfig((prev) => {
          return { ...prev, ...next }
        })
      }
    },
    [setBaseConfig]
  )

  // Memoize context value to prevent unnecessary re-renders of consumers
  // This is critical to avoid infinite update loops when child components
  // have effects that depend on the context value
  const ctxValue = useMemo(
    () => ({ config, setConfig: setConfigMerged, constraints: C }),
    [config, setConfigMerged, C]
  )

  return (
    <UrlConfigProvider value={ctxValue}>
      <ProductPageLayout>
        <Shell />
      </ProductPageLayout>
    </UrlConfigProvider>
  )
}
