import React, { FC, useState } from 'react'
import { Slider } from '~/components/Slider/Slider'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage } from 'react-intl'
import { Dimension } from '~/components/ProductListPage/products'

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
  // const [predefinedWidth, predefinedHeight, predefinedDepth, predefinedPlint] =
  //   predefinedValue?.split('x') ?? []
  return (
    <>
      <h3 className={styles.dimensionsHeaderTitle}>
        <FormattedMessage id="homepage.configurator.dimensions.title" />
      </h3>
      <div className={styles.dimensionsGrid}>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.width" />
          </p>
          {predefinedValue?.width != null ? (
            `${predefinedValue?.width} cm`
          ) : (
            <Slider
              min={configuration.widthRange[0]}
              max={configuration.widthRange[1]}
              step={10}
              value={configuration.width}
              onChange={configuration.setWidth}
            />
          )}
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.height" />
          </p>
          {predefinedValue?.height != null ? (
            `${predefinedValue.height} cm`
          ) : (
            <Slider
              min={configuration.heightRange[0]}
              max={configuration.heightRange[1]}
              step={10}
              value={configuration.height}
              onChange={configuration.setHeight}
            />
          )}
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.depth" />
          </p>
          {predefinedValue?.depth != null ? (
            `${predefinedValue.depth} cm`
          ) : (
            <Slider
              min={configuration.depthRange[0]}
              max={configuration.depthRange[1]}
              step={5}
              value={50}
              onChange={configuration.setDepth}
            />
          )}
        </label>
        <label className={styles.dimensionLabel}>
          <div className={styles.dimensionTitle}>
            <FormattedMessage id="homepage.configurator.dimensions.plintHeight" />
            <div
              className={styles.tooltipContainer}
              onClick={() => setIsModalOpen(true)}
            >
              <InfoOutlinedIcon color="action" sx={{ fontSize: 20 }} />
              <span className={styles.tooltipText}>
                <img src="/wardrobe/base-tooltip.png" alt="base tooltip"></img>
              </span>
            </div>
          </div>
          {predefinedValue?.plintHeight != null ? (
            `${predefinedValue.plintHeight} cm`
          ) : (
            <Slider
              min={configuration.plintHeightRange[0]}
              max={configuration.plintHeightRange[1]}
              step={1}
              value={5}
              onChange={configuration.setPlintHeight}
            />
          )}
        </label>
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
