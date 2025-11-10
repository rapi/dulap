import React, { FC, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { ButtonOptionsType, ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'

interface DoorOpeningSideSelectorProps {
  columnIndex: number
  config: ColumnConfigurationWithOptions
  onDoorOpeningSideChange: (columnIndex: number, side: 'left' | 'right') => void
}

const DOOR_OPENING_SIDE_OPTIONS: ButtonOptionsType<'left' | 'right'>[] = [
  { value: 'left' as const, label: 'homepage.configurator.individualColumns.doorOpeningSide.left' },
  { value: 'right' as const, label: 'homepage.configurator.individualColumns.doorOpeningSide.right' },
]

/**
 * Selector for door opening side (left/right)
 * Only visible for single door configurations
 */
export const DoorOpeningSideSelector: FC<DoorOpeningSideSelectorProps> = ({
  columnIndex,
  config,
  onDoorOpeningSideChange,
}) => {
  const metadata = getConfigurationMetadata(config.type)
  const isSingleDoor = metadata?.doorCount === 1

  if (!isSingleDoor) {
    return null
  }

  const currentSide = config.doorOpeningSide || 'left'

  return (
    <label className={styles.furnitureLabel}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <FormattedMessage
            id="homepage.configurator.individualColumns.doorOpeningSide"
            defaultMessage="Door opening side"
          />
          :
        </span>
        <ButtonSelect
          key={`door-side-${columnIndex}`}
          options={DOOR_OPENING_SIDE_OPTIONS}
          defaultSelected={currentSide}
          onChange={(value) => onDoorOpeningSideChange(columnIndex, value as 'left' | 'right')}
        />
      </div>
    </label>
  )
}

