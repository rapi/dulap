import React, { FC, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { use3DVersion } from '~/hooks/use3DVersion'
import { useMediaQuery } from '@mui/material'
import { useConfiguratorConfig } from '~/context/urlConfigContext'

export type ProductColumnsComponent = {
  type: 'columns'
  selectedColumns: number
  setSelectedColumns: (value: number) => void
  options?: ButtonOptionsType[]
}

interface ProductColumnsProps {
  configuration: ProductColumnsComponent
  predefinedValue?: number
  options?: ButtonOptionsType[]
}

export const columnsOptions: ButtonOptionsType[] = [
  { value: '1', label: 1 },
  { value: '2', label: 2 },
  { value: '3', label: 3 },
  { value: '4', label: 4 },
]

// helpers (no change to ButtonSelect needed)
function isValid(val: number | undefined, opts: ButtonOptionsType[]): boolean {
  if (val == null) return false
  const s = String(val)
  const found = opts.find((o) => o.value === s)
  return !!found && !found.disabled
}
function firstEnabled(opts: ButtonOptionsType[]): number | undefined {
  const f = opts.find((o) => !o.disabled)
  return f ? parseInt(String(f.value), 10) : undefined
}

export const ProductColumns: FC<ProductColumnsProps> = ({
  configuration,
  predefinedValue,
  options: propOptions,
}) => {
  const is3DVersion = use3DVersion()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { config, setConfig } = useConfiguratorConfig()

  // priority: component -> prop -> defaults
  const options = useMemo<ButtonOptionsType[]>(
    () => configuration.options ?? propOptions ?? columnsOptions,
    [configuration.options, propOptions]
  )

  // current (could come from URL or legacy)
  const currentFromUrl =
    typeof config.columns === 'number' ? config.columns : undefined
  const current = currentFromUrl ?? configuration.selectedColumns

  // recompute a valid preset whenever options change
  const desired = useMemo<number | undefined>(() => {
    if (isValid(current, options)) return current
    const fallback = firstEnabled(options)
    return fallback
  }, [current, options])

  // enforce preset into both stores when options change (and on first mount)
  useEffect(() => {
    if (predefinedValue != null) return
    if (desired == null) return
    if (current !== desired) {
      // URL
      setConfig({ ...config, columns: desired })
      // legacy (3D)
      configuration.setSelectedColumns(desired)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    desired,
    predefinedValue,
    /* config, setConfig, */ configuration.setSelectedColumns,
  ])

  const handleChange = (value: string) => {
    // ignore disabled (ButtonSelect already guards clicks, but keep it safe)
    const opt = options.find((o) => o.value === value)
    if (opt?.disabled) return
    const next = parseInt(value, 10)
    if (Number.isNaN(next)) return

    // URL + legacy (until 3D reads URL directly)
    setConfig({ ...config, columns: next })
    configuration.setSelectedColumns(next)
  }

  return (
    <>
      {!isMobile && (
        <p className={styles.sectionsTitle}>
          <FormattedMessage
            id="homepage.configurator.options.title"
            defaultMessage="Opțiuni"
          />
        </p>
      )}

      <div>
        <label className={styles.furnitureLabel}>
          {!isMobile && (
            <p>
              <FormattedMessage
                id="homepage.configurator.columns.title"
                defaultMessage="Numărul de coloane"
              />
            </p>
          )}

          {predefinedValue != null ? (
            predefinedValue
          ) : (
            <ButtonSelect
              options={options}
              // key makes ButtonSelect re-initialize if the preset changes shape
              key={options
                .map((o) => `${o.value}:${o.disabled ? 1 : 0}`)
                .join('|')}
              defaultSelected={String(desired ?? current)}
              onChange={handleChange}
              size="small"
            />
          )}
        </label>
      </div>
    </>
  )
}
