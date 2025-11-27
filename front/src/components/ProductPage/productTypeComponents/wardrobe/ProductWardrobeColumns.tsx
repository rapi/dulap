import React, { FC, useState, useMemo, useCallback, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { 
  WardrobeColumnConfiguration
} from '~/types/wardrobeConfigurationTypes'
import {
  WARDROBE_TEMPLATES,
  getValidTemplates,
  calculateTemplateAdjustment
} from '~/config/wardrobeTemplates'
import { ButtonSelect, ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import { ButtonImageSelect } from '~/components/ButtonImageSelect/ButtonImageSelect'
import layoutStyles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import styles from './ProductWardrobeColumns.module.css'
import { WardrobeConfigurationIcon } from './WardrobeConfigurationIcon'

export type ProductWardrobeColumnsComponent = {
  type: 'wardrobeColumns'
  selectedColumns: number
  columnConfigurations: WardrobeColumnConfiguration[]
  setColumnConfigurations: (configs: WardrobeColumnConfiguration[]) => void
  columnWidth: number
  columnHeight: number // Internal height (without plinth)
  columnDepth: number
}

interface ProductWardrobeColumnsProps {
  configuration: ProductWardrobeColumnsComponent
  activeColumnIndex?: number
  onActiveColumnChange?: (index: number) => void
}

/**
 * Component for configuring individual wardrobe columns with zone-based layouts
 */
export const ProductWardrobeColumns: FC<ProductWardrobeColumnsProps> = ({
  configuration,
  activeColumnIndex: externalActiveIndex,
  onActiveColumnChange
}) => {
  const intl = useIntl()
  const {
    selectedColumns,
    columnConfigurations,
    setColumnConfigurations,
    columnWidth,
    columnHeight
  } = configuration

  // Local state for active column
  const [activeColumnIndex, setActiveColumnIndex] = useState(externalActiveIndex ?? 0)
  
  // Sync with external index if provided
  useEffect(() => {
    if (externalActiveIndex !== undefined) {
      setActiveColumnIndex(externalActiveIndex)
    }
  }, [externalActiveIndex])

  // Handle column tab change
  const handleColumnTabChange = useCallback((value: string) => {
    const index = parseInt(value, 10)
    setActiveColumnIndex(index)
    onActiveColumnChange?.(index)
  }, [onActiveColumnChange])

  // Get valid templates for current dimensions
  const validTemplates = useMemo(
    () => getValidTemplates(columnWidth, columnHeight),
    [columnWidth, columnHeight]
  )

  // Column tab options
  const columnTabOptions: ButtonOptionsType[] = useMemo(
    () => Array.from({ length: selectedColumns }).map((_, index) => ({
      value: String(index),
      label: (
        <FormattedMessage
          id="homepage.configurator.wardrobe.column"
          defaultMessage={`Column ${index + 1}`}
          values={{ number: index + 1 }}
        />
      ),
    })),
    [selectedColumns]
  )

  // Current column configuration
  const currentConfig = columnConfigurations[activeColumnIndex]
  const currentTemplateId = currentConfig?.templateId

  // Handle template selection
  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = WARDROBE_TEMPLATES[templateId]
    if (!template) {
      return
    }

    // Zones always total 200cm regardless of column height
    const FIXED_ZONES_HEIGHT = 200
    const adjustedZones = calculateTemplateAdjustment(template, FIXED_ZONES_HEIGHT)
    
    // Create new config for the selected column
    const newConfig: WardrobeColumnConfiguration = {
      zones: adjustedZones,
      totalHeight: columnHeight,
      doorType: (columnWidth > 60 ? 'split' : 'single') as 'split' | 'single',
      doorOpeningSide: (columnWidth <= 60 ? 'right' : undefined) as 'left' | 'right' | undefined,
      templateId: templateId
    }
    
    // Ensure newConfigs has the right length, filling with existing configs or defaults
    const newConfigs = Array.from({ length: selectedColumns }, (_, i) => {
      if (i === activeColumnIndex) {
        return newConfig
      }
      return columnConfigurations[i] || {
        zones: [],
        totalHeight: columnHeight,
        doorType: 'single' as 'single' | 'split',
        doorOpeningSide: 'right' as 'left' | 'right' | undefined,
        templateId: 'FULL_HANGING'
      }
    })
    
    setColumnConfigurations(newConfigs)
  }, [
    activeColumnIndex, 
    columnConfigurations, 
    setColumnConfigurations,
    columnHeight,
    columnWidth,
    selectedColumns
  ])


  // Map template ID to translation key
  const getTemplateTranslationKey = (templateId: string): { name: string; desc: string } => {
    const keyMap: Record<string, { name: string; desc: string }> = {
      'FULL_HANGING': { 
        name: 'homepage.configurator.wardrobe.template.fullHanging',
        desc: 'homepage.configurator.wardrobe.template.fullHanging.desc'
      },
      'DOUBLE_HANGING': {
        name: 'homepage.configurator.wardrobe.template.doubleHanging',
        desc: 'homepage.configurator.wardrobe.template.doubleHanging.desc'
      },
      'HANGING_WITH_DRAWERS': {
        name: 'homepage.configurator.wardrobe.template.hangingDrawers',
        desc: 'homepage.configurator.wardrobe.template.hangingDrawers.desc'
      },
      'HANGING_WITH_SHELVES': {
        name: 'homepage.configurator.wardrobe.template.hangingShelves',
        desc: 'homepage.configurator.wardrobe.template.hangingShelves.desc'
      },
      'SHELVES_ONLY': {
        name: 'homepage.configurator.wardrobe.template.shelvesOnly',
        desc: 'homepage.configurator.wardrobe.template.shelvesOnly.desc'
      },
      'DRAWERS_ONLY': {
        name: 'homepage.configurator.wardrobe.template.drawersOnly',
        desc: 'homepage.configurator.wardrobe.template.drawersOnly.desc'
      },
      'MIXED_STORAGE_COMPLEX': {
        name: 'homepage.configurator.wardrobe.template.mixedStorage',
        desc: 'homepage.configurator.wardrobe.template.mixedStorage.desc'
      },
      'THREE_ZONE_COMBO': {
        name: 'homepage.configurator.wardrobe.template.threeZone',
        desc: 'homepage.configurator.wardrobe.template.threeZone.desc'
      },
      'SHOE_STORAGE': {
        name: 'homepage.configurator.wardrobe.template.shoeStorage',
        desc: 'homepage.configurator.wardrobe.template.shoeStorage.desc'
      },
      'ACCESSORIES_ORGANIZER': {
        name: 'homepage.configurator.wardrobe.template.accessories',
        desc: 'homepage.configurator.wardrobe.template.accessories.desc'
      },
      'CONFIG_1_HANGING_LONG_BOTTOM': {
        name: 'homepage.configurator.wardrobe.template.config1',
        desc: 'homepage.configurator.wardrobe.template.config1.desc'
      },
      'CONFIG_2_HANGING_2DRAWERS': {
        name: 'homepage.configurator.wardrobe.template.config2',
        desc: 'homepage.configurator.wardrobe.template.config2.desc'
      },
      'CONFIG_3_HANGING_SHORT': {
        name: 'homepage.configurator.wardrobe.template.config3',
        desc: 'homepage.configurator.wardrobe.template.config3.desc'
      },
      'CONFIG_4_SHELVES_2DRAWERS': {
        name: 'homepage.configurator.wardrobe.template.config4',
        desc: 'homepage.configurator.wardrobe.template.config4.desc'
      },
      'CONFIG_5_HANGING_SHELVES_2DRAWERS': {
        name: 'homepage.configurator.wardrobe.template.config5',
        desc: 'homepage.configurator.wardrobe.template.config5.desc'
      },
      'CONFIG_6_HANGING_SHELVES_ITEM': {
        name: 'homepage.configurator.wardrobe.template.config6',
        desc: 'homepage.configurator.wardrobe.template.config6.desc'
      },
      'FULL_HANGING_WITH_1_SHELF': {
        name: 'homepage.configurator.wardrobe.template.fullHangingWith1Shelf',
        desc: 'homepage.configurator.wardrobe.template.fullHangingWith1Shelf.desc'
      },
      'FULL_HANGING_WITH_2_DRAWERS': {
        name: 'homepage.configurator.wardrobe.template.fullHangingWith2Drawers',
        desc: 'homepage.configurator.wardrobe.template.fullHangingWith2Drawers.desc'
      },
      'ONE_TOP_SHELF': {
        name: 'homepage.configurator.wardrobe.template.oneTopShelf',
        desc: 'homepage.configurator.wardrobe.template.oneTopShelf.desc'
      }
    }
    return keyMap[templateId] || { name: templateId, desc: templateId }
  }

  // Map templates to ButtonImageSelect options
  const imageSelectOptions = useMemo(
    () => validTemplates.map(template => {
      const translationKeys = getTemplateTranslationKey(template.id)
      return {
        value: template.id,
        content: (
          <WardrobeConfigurationIcon 
            template={template} 
            width={45} 
            height={60} 
          />
        ),
        label: intl.formatMessage({ id: translationKeys.name, defaultMessage: template.name }),
        title: intl.formatMessage({ id: translationKeys.desc, defaultMessage: template.description }),
      }
    }),
    [validTemplates, intl]
  )

  return (
    <div className={layoutStyles.individualColumnsLabel}>
      {/* Section title */}
      <p className={layoutStyles.sectionTitle}>
        <FormattedMessage 
          id="homepage.configurator.wardrobe.columnConfiguration"
          defaultMessage="Interior Configuration"
        />
      </p>

      <div className={layoutStyles.furnitureConfig}>
        {/* Column selector (if multiple columns) */}
        {selectedColumns > 1 && (
          <div className={layoutStyles.furnitureLabel}>
            <ButtonSelect
              options={columnTabOptions}
              defaultSelected={String(activeColumnIndex)}
              onChange={handleColumnTabChange}
            />
          </div>
        )}

        {/* Configuration type selector */}
        <div className={styles.wardrobeColumnsSection}>
          <ButtonImageSelect<string>
            ariaLabel="Wardrobe interior configuration"
            options={imageSelectOptions}
            value={currentTemplateId || ''}
            onChange={handleTemplateSelect}
          />
        </div>
      </div>
    </div>
  )
}
