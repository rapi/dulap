import React, { useMemo, useState, useEffect } from 'react'
import classNames from 'classnames'
import styles from './SelectColor.module.css'
import { getColorItemByName, ColorItem } from '~/utils/colorDictionary'
import { Modal } from '~/components/Modal/Modal'
import AddIcon from '@mui/icons-material/Add'
import { grey } from '@mui/material/colors'
import { FormattedMessage } from 'react-intl'

export interface SelectColorProps {
  colors: string[]
  defaultSelected?: string
  value?: string
  onChange: (colorName: string) => void
  size?: 'small' | 'medium' | 'large'
  showAdd?: boolean
  addIcon?: React.ReactNode
  onAddClick?: () => void
  colorCTA?: React.ReactNode
  colorCTAWrapperClassName?: string
}

interface SelectColorItemProps {
  hexCode?: string
  name?: string
  materialCode?: string
  textureUrl?: string
  isAdd?: boolean
  icon?: React.ReactNode
  selected: boolean
  size?: 'small' | 'medium' | 'large'
  onClick?: (name?: string, e?: React.MouseEvent<HTMLDivElement>) => void
}

const PALETTE = [
  'Dark Grey',
  'Grey Cubanit',
  'Grey Stone',
  'Green Salvia',
  'Beige Sand',
  'Beige Cashmere',
  'Biege Almond',
  'Rose Antique',
  'Natural Acacia',
  'Natural Walnut',
]

export const SelectColorItem: React.FC<SelectColorItemProps> = ({
  hexCode,
  name,
  materialCode,
  textureUrl,
  isAdd,
  icon,
  selected,
  size = 'medium',
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onClick?.(name, e)
  }

  const backgroundStyle = !isAdd
    ? textureUrl
      ? ({
          backgroundImage: `url(${textureUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } as React.CSSProperties)
      : ({ backgroundColor: hexCode } as React.CSSProperties)
    : undefined

  return (
    <div
      className={classNames(
        styles.colorCircle,
        styles[size + 'Size'],
        selected && styles.selected,
        isAdd && styles.addCircle
      )}
      style={backgroundStyle}
      onClick={handleClick}
      {...(!isAdd && name
        ? {
            'data-tooltip-name': name,
            'data-tooltip-code': materialCode,
          }
        : {})}
    >
      {isAdd && icon}
    </div>
  )
}

const SelectColor: React.FC<SelectColorProps> = ({
  colors: colorNames,
  defaultSelected,
  value, // NEW
  onChange,
  size = 'medium',
  showAdd = false,
  addIcon = <AddIcon fontSize="small" sx={{ color: grey[600] }} />,
  onAddClick,
  colorCTA,
  colorCTAWrapperClassName,
}) => {
  const isControlled = value !== undefined

  // Build items from `colors` prop
  const initialItems: ColorItem[] = useMemo(
    () =>
      colorNames
        .map((n) => getColorItemByName(n))
        .filter((i): i is ColorItem => !!i),
    [colorNames]
  )

  const [items, setItems] = useState<ColorItem[]>(initialItems)

  // Keep items in sync if `colors` prop changes
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  // Uncontrolled internal selected
  const [internalSelected, setInternalSelected] = useState<string>(() => {
    const def =
      defaultSelected && getColorItemByName(defaultSelected)
        ? defaultSelected
        : initialItems[0]?.name || ''
    return def
  })

  // If consumer updates defaultSelected later (rare), reflect it in uncontrolled mode
  useEffect(() => {
    if (!isControlled) {
      const def =
        defaultSelected && getColorItemByName(defaultSelected)
          ? defaultSelected
          : initialItems[0]?.name || ''
      setInternalSelected(def)
    }
  }, [defaultSelected, initialItems, isControlled])

  const effectiveSelected = isControlled ? (value as string) : internalSelected

  const [isModalOpen, setModalOpen] = useState(false)

  const handleSelect = (
    name?: string,
    e?: React.MouseEvent<HTMLDivElement>
  ) => {
    e?.stopPropagation()
    if (!name) return
    if (!isControlled) setInternalSelected(name)
    onChange(name)
  }

  const handleAdd = (_?: string, e?: React.MouseEvent<HTMLDivElement>) => {
    if (onAddClick) return onAddClick()
    e?.stopPropagation()
    setTimeout(() => setModalOpen(true), 0)
  }

  const handleModalPick = (newName: string) => {
    setModalOpen(false)
    const newItem = getColorItemByName(newName)
    if (!newItem) return
    if (!items.find((i) => i.name === newItem.name)) {
      setItems((prev) => [...prev, newItem])
    }
    handleSelect(newName)
  }

  return (
    <div className={styles.container}>
      {items.map((c) => (
        <SelectColorItem
          key={c.materialCode}
          hexCode={c.hexCode}
          name={c.name}
          materialCode={c.materialCode}
          textureUrl={c.textureUrl}
          size={size}
          selected={c.name === effectiveSelected}
          onClick={handleSelect}
        />
      ))}

      {showAdd && (
        <SelectColorItem
          isAdd
          icon={addIcon}
          size={size}
          selected={false}
          onClick={handleAdd}
        />
      )}

      <br />

      {/* CTA under the color row */}
      {colorCTA && <div className={colorCTAWrapperClassName}>{colorCTA}</div>}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3>
          <FormattedMessage id="selectColor.modal.title" />
        </h3>
        <div className={styles.modalColorsContainer}>
          {/* Uncontrolled usage inside modal is fine */}
          <SelectColor
            colors={PALETTE}
            onChange={handleModalPick}
            size="large"
            showAdd={false}
          />
        </div>
      </Modal>
    </div>
  )
}

export default SelectColor
