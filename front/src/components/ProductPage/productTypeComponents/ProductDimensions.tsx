import React, { FC, useState } from 'react'
import { Slider } from '~/components/Slider/Slider'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage } from 'react-intl'
import { Dimension } from '~/components/ProductListPage/products'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Link from 'next/link'
import { useMediaQuery } from '@mui/material'

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

export const ProductDimensions: FC<ProductDimensionsProps> = ({
  configuration,
  predefinedValue,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <>
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
      <div className={styles.dimensionsGrid}>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.width" />
          </p>
          {predefinedValue?.width != null ? (
            `${predefinedValue?.width} cm`
          ) : (
            <div className={styles.dimensionControl}>
              <Slider
                min={configuration.widthRange[0]}
                max={configuration.widthRange[1]}
                step={1}
                value={configuration.width}
                onChange={configuration.setWidth}
              />
            </div>
          )}
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.height" />
          </p>
          {predefinedValue?.height != null ? (
            `${predefinedValue.height} cm`
          ) : (
            <div className={styles.dimensionControl}>
              <Slider
                min={configuration.heightRange[0]}
                max={configuration.heightRange[1]}
                step={configuration.heightStep}
                value={configuration.height}
                onChange={configuration.setHeight}
              />
            </div>
          )}
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.depth" />
          </p>
          {predefinedValue?.depth != null ? (
            `${predefinedValue.depth} cm`
          ) : (
            <div className={styles.dimensionControl}>
              <Slider
                min={configuration.depthRange[0]}
                max={configuration.depthRange[1]}
                step={1}
                value={configuration.depth}
                onChange={configuration.setDepth}
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
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
          }}
        >
          <h4>
            <FormattedMessage id="homepage.configurator.dimensions.hintPlintHeight.1" />
          </h4>
          <div className={styles.modalChildren}>
            <img
              src="/wardrobe/base-tooltip.png"
              alt="base tooltip"
              className={styles.modalImg}
            ></img>
            <p className={styles.modalText}>
              <FormattedMessage id="homepage.configurator.dimensions.hintPlintHeight.2" />
              <br></br>
              <br></br>
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
