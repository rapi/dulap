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
import { useMediaQuery } from '@mui/material'

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
    
    // Preserve hasDoor setting from current config, default to true (closed)
    const currentHasDoor = currentConfig?.hasDoor !== false
    
    // Create new config for the selected column
    const newConfig: WardrobeColumnConfiguration = {
      zones: adjustedZones,
      totalHeight: columnHeight,
      doorType: (columnWidth > 60 ? 'split' : 'single') as 'split' | 'single',
      doorOpeningSide: (columnWidth <= 60 ? 'right' : undefined) as 'left' | 'right' | undefined,
      templateId: templateId,
      hasDoor: currentHasDoor
    }
    
    // Ensure newConfigs has the right length, filling with existing configs or defaults
    const newConfigs = Array.from({ length: selectedColumns }, (_, i) => {
      if (i === activeColumnIndex) {
        return newConfig
      }
      // Use existing config or create default with FULL_HANGING_WITH_1_SHELF template
      if (columnConfigurations[i]) {
        return columnConfigurations[i]
      }
      
      const defaultTemplate = WARDROBE_TEMPLATES['FULL_HANGING_WITH_1_SHELF']
      const FIXED_ZONES_HEIGHT = 200
      const defaultZones = calculateTemplateAdjustment(defaultTemplate, FIXED_ZONES_HEIGHT)
      
      return {
        zones: defaultZones,
        totalHeight: columnHeight,
        doorType: 'single' as 'single' | 'split',
        doorOpeningSide: 'right' as 'left' | 'right' | undefined,
        templateId: 'FULL_HANGING_WITH_1_SHELF',
        hasDoor: true // Default to closed (has door)
      }
    })
    
    setColumnConfigurations(newConfigs)
    
    // Open doors by selecting the current column when configuration is changed
    // This ensures doors open on desktop when user selects internal configuration
    onActiveColumnChange?.(activeColumnIndex)
  }, [
    activeColumnIndex, 
    columnConfigurations, 
    setColumnConfigurations,
    columnHeight,
    columnWidth,
    selectedColumns,
      onActiveColumnChange
  ])

  // Handle door toggle (open/closed)
  const handleDoorToggle = useCallback((value: 'open' | 'closed') => {
    const hasDoor = value === 'closed'
    
    const newConfigs = columnConfigurations.map((config, index) => {
      if (index === activeColumnIndex) {
        return {
          ...config,
          hasDoor
        }
      }
      return config
    })
    
    setColumnConfigurations(newConfigs)
  }, [activeColumnIndex, columnConfigurations, setColumnConfigurations])

  // Map template ID to translation key
  const getTemplateTranslationKey = (templateId: string): { name: string; desc: string } => {
    const keyMap: Record<string, { name: string; desc: string }> = {
      'FULL_HANGING_WITH_1_SHELF': {
        name: 'homepage.configurator.wardrobe.template.fullHangingWith1Shelf',
        desc: 'homepage.configurator.wardrobe.template.fullHangingWith1Shelf.desc'
      },
      'FULL_HANGING_WITH_2_DRAWERS': {
        name: 'homepage.configurator.wardrobe.template.fullHangingWith2Drawers',
        desc: 'homepage.configurator.wardrobe.template.fullHangingWith2Drawers.desc'
      },
      'SHELVES_ONLY': {
        name: 'homepage.configurator.wardrobe.template.shelvesOnly',
        desc: 'homepage.configurator.wardrobe.template.shelvesOnly.desc'
      },
      'MIXED_STORAGE_COMPLEX': {
        name: 'homepage.configurator.wardrobe.template.mixedStorage',
        desc: 'homepage.configurator.wardrobe.template.mixedStorage.desc'
      },
      'HANGING_WITH_DRAWERS': {
        name: 'homepage.configurator.wardrobe.template.hangingDrawers',
        desc: 'homepage.configurator.wardrobe.template.hangingDrawers.desc'
      },
      'DOUBLE_HANGING': {
        name: 'homepage.configurator.wardrobe.template.doubleHanging',
        desc: 'homepage.configurator.wardrobe.template.doubleHanging.desc'
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
        title: intl.formatMessage({ id: translationKeys.desc, defaultMessage: template.description }),
      }
    }),
    [validTemplates, intl]
  )
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className={layoutStyles.individualColumnsLabel}>
      {/* Section title */}
      {!isMobile && (
        <p className={layoutStyles.sectionTitle} style={{ margin: '0' }}>
          <FormattedMessage 
            id="homepage.configurator.wardrobe.columnConfiguration"
            defaultMessage="Interior Configuration"
          />
        </p>
      )}

      <div className={layoutStyles.columnsConfig}>
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

        {/* Door toggle (open/closed) */}
        <div className={layoutStyles.furnitureLabel}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '5px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              <FormattedMessage
                id="homepage.configurator.wardrobe.columnDoor"
                defaultMessage="Column door"
              />
              :
            </span>
            <ButtonSelect
              options={[
                { value: 'closed', label: <FormattedMessage id="homepage.configurator.wardrobe.columnDoor.closed" defaultMessage="Closed" /> },
                { value: 'open', label: <FormattedMessage id="homepage.configurator.wardrobe.columnDoor.open" defaultMessage="Open" /> },
              ]}
              defaultSelected={currentConfig?.hasDoor !== false ? 'closed' : 'open'}
              onChange={(value) => handleDoorToggle(value as 'open' | 'closed')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
