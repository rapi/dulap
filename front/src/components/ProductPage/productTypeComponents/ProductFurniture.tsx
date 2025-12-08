import React, { FC, useState, useMemo, useEffect } from 'react'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage, useIntl } from 'react-intl'
import { Modal } from '~/components/Modal/Modal'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import {
  ButtonImageSelect,
  ButtonImageOption,
} from '~/components/ButtonImageSelect/ButtonImageSelect'
import { useMediaQuery } from '@mui/material'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'

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
  isWardrobe?: boolean // Whether this is for wardrobe (uses different door icons)
}

export type ProductFurniturePredefinedValue = {
  openingType: OpeningType
  hinges?:
    | 'homepage.configurator.fittings.hinges.options.1'
    | 'homepage.configurator.fittings.hinges.options.2'
  guides?:
    | 'homepage.configurator.fittings.guides.options.1'
    | 'homepage.configurator.fittings.guides.options.2'
}

/** Options for ButtonImageSelect: icon + i18n label */
export const openingOptions: ButtonImageOption<OpeningType>[] = [
  {
    value: OpeningType.RoundHandle,
    content: <img src="/assets/icons/roundHandle.svg" alt="Round handle" />,
  },
  {
    value: OpeningType.ProfileHandle,
    content: <img src="/assets/icons/profileHandle.svg" alt="Profile handle" />,
  },
  {
    value: OpeningType.ProfileHandleLong,
    content: <img src="/assets/icons/profileHandle.svg" alt="Profile handle long" />,
  },
  {
    value: OpeningType.Push,
    content: <img src="/assets/icons/push.svg" alt="Push to open" />,
  },
]

/** Wardrobe-specific options with door-like icons */
export const wardrobeOpeningOptions: ButtonImageOption<OpeningType>[] = [
  {
    value: OpeningType.RoundHandle,
    content: <img src="/assets/icons/wardrobeRoundHandle.svg" alt="Round handle" />,
  },
  {
    value: OpeningType.ProfileHandle,
    content: <img src="/assets/icons/wardrobeProfileHandle.svg" alt="Profile handle" />,
  },
  {
    value: OpeningType.ProfileHandleLong,
    content: <img src="/assets/icons/wardrobeProfileHandleLong.svg" alt="Profile handle long" />,
  },
]

interface ProductSelectProps {
  configuration: ProductFurnitureComponent
  predefinedValue?: ProductFurniturePredefinedValue
  onOpeningTypeChange?: (value: OpeningType) => void
}

export const ProductFurniture: FC<ProductSelectProps> = ({
  configuration,
  predefinedValue,
  onOpeningTypeChange,
}) => {
  const intl = useIntl()
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Get URL context for synchronization
  const urlCtx = useConfiguratorConfigOptional()

  // Choose icon set based on product type
  const iconOptions = configuration.isWardrobe ? wardrobeOpeningOptions : openingOptions
  
  // Filter opening options based on 3D availability
  const availableOpeningOptions = configuration.is3DEnabled
    ? iconOptions
    : iconOptions.filter(
        (option) => option.value !== OpeningType.ProfileHandle && option.value !== OpeningType.ProfileHandleLong
      )
  
  // Ensure current value is in available options (safeguard for wardrobes where Push was removed)
  const currentValue = useMemo(() => {
    const isValueAvailable = availableOpeningOptions.some(opt => opt.value === configuration.openingOption)
    if (!isValueAvailable && availableOpeningOptions.length > 0) {
      // If current value is not available (e.g., Push for wardrobes), prefer ProfileHandleLong for wardrobes
      if (configuration.isWardrobe) {
        const longProfileOption = availableOpeningOptions.find(opt => opt.value === OpeningType.ProfileHandleLong)
        if (longProfileOption) {
          return longProfileOption.value
        }
      }
      // Otherwise use first available option
      return availableOpeningOptions[0].value
    }
    return configuration.openingOption
  }, [configuration.openingOption, configuration.isWardrobe, availableOpeningOptions])
  
  // Update configuration if value was changed
  useEffect(() => {
    if (currentValue !== configuration.openingOption) {
      configuration.setOpeningOption(currentValue)
    }
  }, [currentValue, configuration])
  
  // Handle opening type change with URL sync
  const handleOpeningTypeChange = (value: OpeningType) => {
    // Update local state
    configuration.setOpeningOption(value)
    
    // Sync to URL
    if (urlCtx) {
      // Map OpeningType enum to URL format ('push' | 'round' | 'profile' | 'profile-long')
      let urlValue: 'push' | 'round' | 'profile' | 'profile-long'
      if (value === OpeningType.Push) {
        urlValue = 'push'
      } else if (value === OpeningType.ProfileHandle) {
        urlValue = 'profile'
      } else if (value === OpeningType.ProfileHandleLong) {
        urlValue = 'profile-long'
      } else {
        urlValue = 'round' // RoundHandle is default for handles
      }
      
      urlCtx.setConfig({ 
        ...urlCtx.config, 
        openingType: urlValue 
      })
    }
    
    // Call optional callback (e.g., to close doors when handle type changes)
    onOpeningTypeChange?.(value)
  }

  return (
    <div>
      {!isMobile && (
        <p className={styles.furnitureHeaderTitle}>
          <FormattedMessage id="homepage.configurator.fittings.title" />
        </p>
      )}
      <label className={styles.furnitureLabel}>
        {!isMobile && (
          <div className={styles.furnitureTitle}>
            <FormattedMessage id="homepage.configurator.fittings.handleType" />
          </div>
        )}
        <div className={styles.openingTypeContent}>
          {predefinedValue?.openingType ? (
            intl.formatMessage({ id: predefinedValue.openingType })
          ) : (
            <ButtonImageSelect<OpeningType>
              ariaLabel={intl.formatMessage({
                id: 'homepage.configurator.fittings.handleType',
              })}
              options={availableOpeningOptions}
              value={currentValue}
              onChange={handleOpeningTypeChange}
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
