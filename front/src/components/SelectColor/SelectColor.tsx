import React, { useState } from 'react'
import classNames from 'classnames'
import styles from './SelectColor.module.css'
import { getColorItemByName, ColorItem } from '~/utils/colorDictionary'
import { Modal } from '~/components/Modal/Modal'
import AddIcon from '@mui/icons-material/Add'
import { grey } from '@mui/material/colors'
import { FormattedMessage } from 'react-intl'

interface SelectColorProps {
  colors: string[]
  defaultSelected?: string
  onChange: (colorName: string) => void
  size?: 'small' | 'medium' | 'large'
  showAdd?: boolean
  addIcon?: React.ReactNode
  onAddClick?: () => void
  /** Optional: render a CTA (e.g., <ColorCTA />) under the color row */
  colorCTA?: React.ReactNode
  /** Optional: wrapper class for the CTA */
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
  size,
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
  onChange,
  size = 'medium',
  showAdd = false,
  addIcon = <AddIcon fontSize="small" sx={{ color: grey[600] }} />,
  onAddClick,
  colorCTA,
  colorCTAWrapperClassName,
}) => {
  const initialItems: ColorItem[] = colorNames
    .map((n) => getColorItemByName(n))
    .filter((i): i is ColorItem => !!i)

  const [items, setItems] = useState<ColorItem[]>(initialItems)

  const [selected, setSelected] = useState<string>(
    defaultSelected && getColorItemByName(defaultSelected)
      ? defaultSelected
      : initialItems[0]?.name || ''
  )

  const [isModalOpen, setModalOpen] = useState(false)

  const handleSelect = (
    name?: string,
    e?: React.MouseEvent<HTMLDivElement>
  ) => {
    e?.stopPropagation()
    if (!name) return
    setSelected(name)
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
          selected={c.name === selected}
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
      {colorCTA && (
        <div className={colorCTAWrapperClassName} style={{ marginTop: 12 }}>
          {colorCTA}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3>
          <FormattedMessage id="selectColor.modal.title" />
        </h3>
        <div className={styles.modalColorsContainer}>
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
