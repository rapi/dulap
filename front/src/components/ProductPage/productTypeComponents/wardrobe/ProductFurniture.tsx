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
import { use3DVersion } from '~/hooks/use3DVersion'

export type ProductFurnitureComponent = {
  type: 'furniture'
  selectedOpeningMethod: string
  setSelectedOpeningMethod: (value: string) => void
  hinges: string
  setHinges: (value: string) => void
  guides: string
  setGuides: (value: string) => void
  predefinedValue?: ProductFurniturePredefinedValue
}
export const openingOptions: ButtonOptionsType[] = [
  { value: 'maner', label: 'homepage.configurator.fittings.roundHandle' },
  {
    value: 'profile-handle',
    label: 'homepage.configurator.fittings.profileHandle',
  },
  { value: 'push', label: 'homepage.configurator.fittings.pushToOpen' },
]
interface ProductSelectProps {
  configuration: ProductFurnitureComponent
  predefinedValue?: ProductFurniturePredefinedValue
}
export type ProductFurniturePredefinedValue = {
  openingType: 'maner' | 'profile-handle' | 'push'
  hinges:
    | 'homepage.configurator.fittings.hinges.options.1'
    | 'homepage.configurator.fittings.hinges.options.2'
  guides:
    | 'homepage.configurator.fittings.guides.options.1'
    | 'homepage.configurator.fittings.guides.options.2'
}
export const ProductFurniture: FC<ProductSelectProps> = ({
  configuration: { setSelectedOpeningMethod, setHinges, setGuides },
  predefinedValue,
}) => {
  const intl = useIntl()
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const is3DVersion = use3DVersion()

  // Filter opening options: only show profile-handle for 3D version
  const availableOpeningOptions = is3DVersion
    ? openingOptions
    : openingOptions.filter((option) => option.value !== 'profile-handle')

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
            <ButtonSelect
              options={availableOpeningOptions}
              defaultSelected={'maner'}
              onChange={(value) => {
                setSelectedOpeningMethod(value)
              }}
            />
          )}
        </div>
      </label>

      <label className={styles.furnitureLabel}>
        <div className={styles.furnitureTitle}>
          <FormattedMessage id="homepage.configurator.fittings.hinges" />
          <div
            className={styles.tooltipContainer}
            onClick={() => setIsModalOpen2(true)}
          >
            <InfoOutlinedIcon color="action" sx={{ fontSize: 20 }} />
            <span className={styles.tooltipText}>
              <img
                src="/wardrobe/hinges-tooltip-onhover.jpg"
                alt="base tooltip"
              ></img>
            </span>
          </div>
        </div>
        {predefinedValue?.hinges ? (
          intl.formatMessage({ id: predefinedValue.hinges })
        ) : (
          <Select
            options={[
              'homepage.configurator.fittings.hinges.options.1',
              'homepage.configurator.fittings.hinges.options.2',
            ]}
            onChange={(value) => {
              setHinges(value)
            }}
          />
        )}
      </label>
    </div>
  )
}
