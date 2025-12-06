import React, { FC, useState, useMemo, useCallback, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { 
  BookcaseColumnConfiguration
} from '~/types/bookcaseConfigurationTypes'
import {
  BOOKCASE_TEMPLATES,
  getValidTemplates,
  calculateZonesFromTemplate
} from '~/config/bookcaseTemplates'
import { ButtonSelect, ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import { ButtonImageSelect } from '~/components/ButtonImageSelect/ButtonImageSelect'
import layoutStyles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import styles from './ProductBookcaseColumns.module.css'
import { BookcaseConfigurationIcon } from './BookcaseConfigurationIcon'
import { useMediaQuery } from '@mui/material'

export type ProductBookcaseColumnsComponent = {
  type: 'bookcaseColumns'
  selectedColumns: number
  columnConfigurations: BookcaseColumnConfiguration[]
  setColumnConfigurations: (configs: BookcaseColumnConfiguration[]) => void
  columnWidth: number
  columnHeight: number // Internal height (without plinth)
  columnDepth: number
}

interface ProductBookcaseColumnsProps {
  configuration: ProductBookcaseColumnsComponent
  activeColumnIndex?: number
  onActiveColumnChange?: (index: number) => void
}

/**
 * Component for configuring individual bookcase columns with zone-based layouts
 */
export const ProductBookcaseColumns: FC<ProductBookcaseColumnsProps> = ({
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
          id="homepage.configurator.bookcase.column"
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
    const template = BOOKCASE_TEMPLATES[templateId]
    if (!template) {
      return
    }

    // Calculate zones dynamically based on actual column height
    const calculatedZones = calculateZonesFromTemplate(template, columnHeight)
    
    // Create new config for the selected column
    const newConfig: BookcaseColumnConfiguration = {
      zones: calculatedZones,
      totalHeight: columnHeight,
      doors: template.doors || [],
      templateId: templateId
    }
    
    // Ensure newConfigs has the right length, filling with existing configs or defaults
    const newConfigs = Array.from({ length: selectedColumns }, (_, i) => {
      if (i === activeColumnIndex) {
        return newConfig
      }
      // Use existing config or create default with OPEN_SHELVES_ONLY template
      if (columnConfigurations[i]) {
        return columnConfigurations[i]
      }
      
      const defaultTemplate = BOOKCASE_TEMPLATES['OPEN_SHELVES_ONLY']
      const defaultZones = calculateZonesFromTemplate(defaultTemplate, columnHeight)
      
      return {
        zones: defaultZones,
        totalHeight: columnHeight,
        doors: defaultTemplate.doors || [],
        templateId: 'OPEN_SHELVES_ONLY'
      }
    })
    
    setColumnConfigurations(newConfigs)
  }, [
    activeColumnIndex, 
    columnConfigurations, 
    setColumnConfigurations,
    columnHeight,
    selectedColumns
  ])

  // Map template ID to translation key
  const getTemplateTranslationKey = (templateId: string): { name: string; desc: string } => {
    const keyMap: Record<string, { name: string; desc: string }> = {
      'OPEN_SHELVES_ONLY': {
        name: 'homepage.configurator.bookcase.template.openShelvesOnly',
        desc: 'homepage.configurator.bookcase.template.openShelvesOnly.desc'
      },
      'SHELVES_WITH_FULL_DOOR': {
        name: 'homepage.configurator.bookcase.template.shelvesWithFullDoor',
        desc: 'homepage.configurator.bookcase.template.shelvesWithFullDoor.desc'
      },
      'HALF_OPEN_HALF_CLOSED': {
        name: 'homepage.configurator.bookcase.template.halfOpenHalfClosed',
        desc: 'homepage.configurator.bookcase.template.halfOpenHalfClosed.desc'
      },
      'DRAWERS_AND_SHELVES': {
        name: 'homepage.configurator.bookcase.template.drawersAndShelves',
        desc: 'homepage.configurator.bookcase.template.drawersAndShelves.desc'
      },
      'MIXED_STORAGE': {
        name: 'homepage.configurator.bookcase.template.mixedStorage',
        desc: 'homepage.configurator.bookcase.template.mixedStorage.desc'
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
          <BookcaseConfigurationIcon 
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
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className={layoutStyles.individualColumnsLabel}>
      {/* Section title */}
      {!isMobile && (
        <p className={layoutStyles.sectionTitle}>
          <FormattedMessage 
            id="homepage.configurator.bookcase.columnConfiguration"
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
        <div className={styles.bookcaseColumnsSection}>
          <ButtonImageSelect<string>
            ariaLabel="Bookcase interior configuration"
            options={imageSelectOptions}
            value={currentTemplateId || ''}
            onChange={handleTemplateSelect}
          />
        </div>
      </div>
    </div>
  )
}

