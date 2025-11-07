import React, { FC, useState } from 'react'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage, useIntl } from 'react-intl'
import { Modal } from '~/components/Modal/Modal'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import {
  ButtonImageSelect,
  ButtonImageOption,
} from '~/components/ButtonImageSelect/ButtonImageSelect'

export type ProductFurnitureComponent = {
  type: 'furniture'
  openingOption: OpeningType
  selectedOpeningMethod: OpeningType
  setOpeningOption: (openingOption: OpeningType) => void
  guides: string
  setGuides: (value: string) => void
  predefinedValue?: ProductFurniturePredefinedValue
  hinges: string
  is3DEnabled?: boolean
}

export type ProductFurniturePredefinedValue = {
  openingType: OpeningType
  hinges?:
    | 'homepage.configurator.fittings.hinges.options.1'
    | 'homepage.configurator.fittings.hinges.options.2'
  guides:
    | 'homepage.configurator.fittings.guides.options.1'
    | 'homepage.configurator.fittings.guides.options.2'
}

/** Options for ButtonImageSelect: icon + i18n label */
export const openingOptions: ButtonImageOption<OpeningType>[] = [
  {
    value: OpeningType.RoundHandle,
    content: <img src="/assets/icons/roundHandle.svg" alt="Round handle" />,
    label: <FormattedMessage id="homepage.configurator.fittings.roundHandle" />,
  },
  {
    value: OpeningType.ProfileHandle,
    content: <img src="/assets/icons/profileHandle.svg" alt="Profile handle" />,
    label: (
      <FormattedMessage id="homepage.configurator.fittings.profileHandle" />
    ),
  },
  {
    value: OpeningType.Push,
    content: <img src="/assets/icons/push.svg" alt="Push to open" />,
    label: <FormattedMessage id="homepage.configurator.fittings.pushToOpen" />,
  },
]

interface ProductSelectProps {
  configuration: ProductFurnitureComponent
  predefinedValue?: ProductFurniturePredefinedValue
}

export const ProductFurniture: FC<ProductSelectProps> = ({
  configuration,
  predefinedValue,
}) => {
  const intl = useIntl()
  const [isModalOpen3, setIsModalOpen3] = useState(false)

  // Filter opening options based on 3D availability
  const availableOpeningOptions = configuration.is3DEnabled
    ? openingOptions
    : openingOptions.filter(
        (option) => option.value !== OpeningType.ProfileHandle
      )

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
          {predefinedValue?.openingType ? (
            intl.formatMessage({ id: predefinedValue.openingType })
          ) : (
            <ButtonImageSelect<OpeningType>
              ariaLabel={intl.formatMessage({
                id: 'homepage.configurator.fittings.handleType',
              })}
              options={availableOpeningOptions}
              value={configuration.openingOption}
              onChange={(value) => configuration.setOpeningOption(value)}
            />
          )}
        </div>
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
          />
          <p className={styles.modalText}>
            <FormattedMessage id="homepage.configurator.fittings.guides.tooltip.2" />
            <br />
            <br />
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
