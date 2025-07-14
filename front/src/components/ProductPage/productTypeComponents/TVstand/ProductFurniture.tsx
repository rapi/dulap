import React, { FC, useState } from 'react'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import Select from '~/components/Select/Select'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Modal } from '~/components/Modal/Modal'

export type ProductFurnitureComponent = {
  type: 'furniture'
  selectedOpeningMethod: string

  openingOption: string
  hinges: string
  setOpeningOption: (openingOption: string) => void
  guides: string
  setGuides: (value: string) => void
  predefinedValue?: ProductFurniturePredefinedValue
}
export const openingOptions: ButtonOptionsType[] = [
  { value: 'maner', label: 'homepage.configurator.fittings.handle' },
  { value: 'push', label: 'homepage.configurator.fittings.pushToOpen' },
]
interface ProductSelectProps {
  configuration: ProductFurnitureComponent
  predefinedValue?: ProductFurniturePredefinedValue
}
export type ProductFurniturePredefinedValue = {
  openingType: 'maner' | 'push'
  guides:
    | 'homepage.configurator.fittings.guides.options.1'
    | 'homepage.configurator.fittings.guides.options.2'
  hinges?:
    | 'homepage.configurator.fittings.hinges.options.1'
    | 'homepage.configurator.fittings.hinges.options.2'
}
export const ProductFurniture: FC<ProductSelectProps> = ({
  configuration,
  predefinedValue,
}) => {
  const intl = useIntl()
  const [isModalOpen3, setIsModalOpen3] = useState(false)

  return (
    <div>
      <p className={styles.furnitureHeaderTitle}>
        <FormattedMessage id="homepage.configurator.fittings.title" />
      </p>

      <label className={styles.furnitureLabel}>
        <div className={styles.furnitureTitle}>
          <FormattedMessage id="homepage.configurator.fittings.handleType" />
        </div>

        <div className={styles.openingTypeContent}>
          {predefinedValue?.openingType ?? (
            <ButtonSelect
              options={openingOptions}
              defaultSelected={configuration.openingOption}
              onChange={(value) => {
                configuration.setOpeningOption(value)
              }}
            />
          )}
        </div>
      </label>
      <label className={styles.furnitureLabel}>
        <div className={styles.furnitureTitle}>
          <FormattedMessage id="homepage.configurator.fittings.guides" />
          <div
            className={styles.tooltipContainer}
            onClick={() => setIsModalOpen3(true)}
          >
            <InfoOutlinedIcon color="action" sx={{ fontSize: 20 }} />
            <span className={styles.tooltipText}>
              <img src="/wardrobe/guides-tooltip.png" alt="base tooltip"></img>
            </span>
          </div>
        </div>
        {predefinedValue?.guides ? (
          intl.formatMessage({ id: predefinedValue.guides })
        ) : (
          <Select
            options={[
              'homepage.configurator.fittings.guides.options.1',
              'homepage.configurator.fittings.guides.options.2',
            ]}
            defaultValue={configuration.guides}
            onChange={(value) => {
              configuration.setGuides(value)
            }}
          />
        )}
      </label>
      <Modal
        isOpen={isModalOpen3}
        onClose={() => {
          setIsModalOpen3(false)
        }}
      >
        <h4>
          <FormattedMessage id="homepage.configurator.fittings.guides.tooltip.1" />
        </h4>
        <div className={styles.modalChildren}>
          <img
            src="/wardrobe/guides-tooltip.png"
            alt="base tooltip"
            className={styles.modalImg}
          ></img>
          <p className={styles.modalText}>
            <FormattedMessage id="homepage.configurator.fittings.guides.tooltip.2" />
            <br></br>
            <br></br>
            <b>
              <FormattedMessage id="homepage.configurator.fittings.guides.tooltip.3" />
            </b>
            <ul>
              <li>
                <FormattedMessage id="homepage.configurator.fittings.guides.tooltip.4" />
              </li>
              <li>
                <FormattedMessage id="homepage.configurator.fittings.guides.tooltip.5" />
              </li>
            </ul>
          </p>
        </div>
      </Modal>
    </div>
  )
}
