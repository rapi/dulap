import React, { FC } from 'react'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import Select from '~/components/Select/Select'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl';

export type ProductFurnitureComponent = {
  type: 'furniture'
  selectedOpeningMethod: string
  setSelectedOpeningMethod: (value: string) => void
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
  hinges: 'homepage.configurator.fittings.hinges.options.1' | 
          'homepage.configurator.fittings.hinges.options.2' | 
          'homepage.configurator.fittings.hinges.options.3'
  guides: 'homepage.configurator.fittings.guides.options.1' | 
          'homepage.configurator.fittings.guides.options.2' | 
          'homepage.configurator.fittings.guides.options.3'
}
export const ProductFurniture: FC<ProductSelectProps> = ({
  configuration: { setSelectedOpeningMethod },
  predefinedValue,
}) => {
  const intl = useIntl();
  
  return (
    <div>
      <p className={styles.furnitureTitle}><FormattedMessage id="homepage.configurator.fittings.title" /></p>

      <label className={styles.furnitureLabel}>
        <p><FormattedMessage id="homepage.configurator.fittings.handleType" /></p>
        <div className={styles.openingTypeContent}>
          {predefinedValue?.openingType ?? (
            <ButtonSelect
              options={openingOptions}
              defaultSelected={'maner'}
              onChange={(value) => {
                setSelectedOpeningMethod(value)
              }}
            />
          )}
        </div>
      </label>

      <label className={styles.furnitureLabel}>
        <p><FormattedMessage id="homepage.configurator.fittings.hinges" /></p>
        {predefinedValue?.hinges 
        ? intl.formatMessage({ id: predefinedValue.hinges }) 
        : (
          <Select options={['homepage.configurator.fittings.hinges.options.1', 
                            'homepage.configurator.fittings.hinges.options.2', 
                            'homepage.configurator.fittings.hinges.options.3']} />
        )}
      </label>
      <label className={styles.furnitureLabel}>
        <p><FormattedMessage id="homepage.configurator.fittings.guides" /></p>
        {predefinedValue?.guides 
        ? intl.formatMessage({ id: predefinedValue.guides }) 
        : (
          <Select options={['homepage.configurator.fittings.hinges.options.1', 
                            'homepage.configurator.fittings.hinges.options.2', 
                            'homepage.configurator.fittings.hinges.options.3']} />
        )}
      </label>
    </div>
  )
}
