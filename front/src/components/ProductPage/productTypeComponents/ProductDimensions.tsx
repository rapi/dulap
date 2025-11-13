import React, { FC, useState, useMemo, useEffect, useCallback } from 'react'
import { Slider } from '~/components/Slider/Slider'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage } from 'react-intl'
import { Dimension } from '~/components/ProductListPage/products'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Link from 'next/link'
import { useMediaQuery } from '@mui/material'
import { use3DVersion } from '~/hooks/use3DVersion'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'

export type ProductDimensionsComponent = {
  predefinedValue?: Dimension
  type: 'dimensions'
  widthRange: [number, number]
  heightRange: [number, number]
  depthRange: [number, number]
  plintHeightRange: [number, number]
  width: number
  setWidth: (value: number) => void
  height: number
  setHeight: (value: number) => void
  heightStep: number
  depth: number
  setDepth: (value: number) => void
  plintHeight: number
  setPlintHeight: (value: number) => void
}
interface ProductDimensionsProps {
  configuration: ProductDimensionsComponent
  predefinedValue?: Dimension
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
function snap(v: number, step: number) {
  return Math.round(v / step) * step
}

export const ProductDimensions: FC<ProductDimensionsProps> = ({
  configuration,
  predefinedValue,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const is3DVersion = use3DVersion()
  const isMobile = useMediaQuery('(max-width: 768px)')

  // OPTIONAL context (null on product preview pages)
  const ctx = useConfiguratorConfigOptional()

  // Prefer constraints from context; otherwise fall back to component props
  const widthRange: [number, number] = useMemo(() => {
    if (ctx) {
      const { dimensions } = ctx.constraints
      return [dimensions.width.min, dimensions.width.max]
    }
    return configuration.widthRange
  }, [ctx, configuration.widthRange])

  const heightRange: [number, number] = useMemo(() => {
    if (ctx) {
      const { dimensions } = ctx.constraints
      return [dimensions.height.min, dimensions.height.max]
    }
    return configuration.heightRange
  }, [ctx, configuration.heightRange])

  const depthRange: [number, number] = useMemo(() => {
    if (ctx) {
      const { dimensions } = ctx.constraints
      return [dimensions.depth.min, dimensions.depth.max]
    }
    return configuration.depthRange
  }, [ctx, configuration.depthRange])

  const widthStep: number = useMemo(() => {
    return ctx?.constraints.steps?.widthStep ?? 1
  }, [ctx])

  const heightStep: number = useMemo(() => {
    return ctx?.constraints.steps?.heightStep ?? configuration.heightStep ?? 1
  }, [ctx, configuration.heightStep])

  const depthStep: number = useMemo(() => {
    return ctx?.constraints.steps?.depthStep ?? 1
  }, [ctx])

  // Current values: from URL (if ctx) else from configuration props
  const widthValue: number = ctx?.config.width ?? configuration.width
  const heightValue: number = ctx?.config.height ?? configuration.height
  const depthValue: number = ctx?.config.depth ?? configuration.depth

  // Dual-write helpers: update URL (when ctx) + legacy setters
  const setWidthBoth = useCallback(
    (val: number) => {
      const next = clamp(snap(val, widthStep), widthRange[0], widthRange[1])
      if (ctx) ctx.setConfig({ ...ctx.config, width: next })
      configuration.setWidth(next)
    },
    [ctx, configuration, widthStep, widthRange]
  )

  const setHeightBoth = useCallback(
    (val: number) => {
      const next = clamp(snap(val, heightStep), heightRange[0], heightRange[1])
      if (ctx) ctx.setConfig({ ...ctx.config, height: next })
      configuration.setHeight(next)
    },
    [ctx, configuration, heightStep, heightRange]
  )

  const setDepthBoth = useCallback(
    (val: number) => {
      const next = clamp(snap(val, depthStep), depthRange[0], depthRange[1])
      if (ctx) ctx.setConfig({ ...ctx.config, depth: next })
      configuration.setDepth(next)
    },
    [ctx, configuration, depthStep, depthRange]
  )

  // Hydrate legacy state from URL on refresh/deeplink — only when ctx exists
  useEffect(() => {
    if (!ctx || predefinedValue) return
    if (configuration.width !== widthValue) configuration.setWidth(widthValue)
    if (configuration.height !== heightValue)
      configuration.setHeight(heightValue)
    if (configuration.depth !== depthValue) configuration.setDepth(depthValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, widthValue, heightValue, depthValue, predefinedValue])

  return (
    <>
      {!isMobile && (
        <div className={styles.dimensionsTitleLabel}>
          <h3 className={styles.dimensionsHeaderTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.title" />
          </h3>
          <Link
            href="/blog/measurements"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.dimensionsTooltipContainer}
            title="Cum să alegi corect mărimile?"
            aria-describedby="dims-tooltip"
            aria-label="Cum să alegi corect mărimile?"
          >
            <HelpOutlineIcon color="action" sx={{ fontSize: 20 }} />
            <span id="dims-tooltip" className={styles.dimensionsTooltipText}>
              <FormattedMessage id="dimensions.title.tooltip" />
            </span>
          </Link>
        </div>
      )}

      <div className={styles.dimensionsGrid}>
        {/* Width */}
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.width" />
          </p>
          {predefinedValue?.width != null ? (
            `${predefinedValue.width} cm`
          ) : (
            <div className={styles.dimensionControl}>
              <Slider
                min={widthRange[0]}
                max={widthRange[1]}
                step={widthStep}
                value={widthValue}
                onChange={setWidthBoth}
              />
            </div>
          )}
        </label>

        {/* Height */}
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.height" />
          </p>
          {predefinedValue?.height != null ? (
            `${predefinedValue.height} cm`
          ) : (
            <div className={styles.dimensionControl}>
              <Slider
                min={heightRange[0]}
                max={heightRange[1]}
                step={heightStep}
                value={heightValue}
                onChange={setHeightBoth}
              />
            </div>
          )}
        </label>

        {/* Depth */}
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.depth" />
          </p>
          {predefinedValue?.depth != null ? (
            `${predefinedValue.depth} cm`
          ) : (
            <div className={styles.dimensionControl}>
              <Slider
                min={depthRange[0]}
                max={depthRange[1]}
                step={depthStep}
                value={depthValue}
                onChange={setDepthBoth}
              />
            </div>
          )}
        </label>

        {isMobile && (
          <div className={styles.dimensionsQuestion}>
            <HelpOutlineIcon color="action" sx={{ fontSize: 20 }} />
            &nbsp;
            <FormattedMessage
              id="homepage.configurator.dimensions.measurementsHelp"
              defaultMessage="<a>Cum măsori corect spațiul?</a>"
              values={{
                a: (chunks) => (
                  <Link
                    href="/blog/measurements"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.dimensionsMobileTooltip}
                  >
                    {chunks}
                  </Link>
                ),
              }}
            />
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h4>
            <FormattedMessage id="homepage.configurator.dimensions.hintPlintHeight.1" />
          </h4>
          <div className={styles.modalChildren}>
            <img
              src="/wardrobe/base-tooltip.png"
              alt="base tooltip"
              className={styles.modalImg}
            />
            <p className={styles.modalText}>
              <FormattedMessage id="homepage.configurator.dimensions.hintPlintHeight.2" />
              <br />
              <br />
              <b>
                <FormattedMessage id="homepage.configurator.dimensions.hintPlintHeight.3" />
              </b>
              <ul>
                <li>
                  <FormattedMessage id="homepage.configurator.dimensions.hintPlintHeight.4" />
                </li>
                <li>
                  <FormattedMessage id="homepage.configurator.dimensions.hintPlintHeight.5" />
                </li>
              </ul>
            </p>
          </div>
        </Modal>
      </div>
    </>
  )
}
