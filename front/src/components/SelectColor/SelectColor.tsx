import React, { useState, useEffect } from 'react'
import styles from './SelectColor.module.css'
import classNames from 'classnames'
import { Modal } from '~/components/Modal/Modal'

interface SelectColorProps {
  colors: string[]
  defaultSelected?: string
  onChange: (color: string) => void
  size?: 'small' | 'medium' | 'large'
  addIcon?: React.ReactNode
  onAddClick?: () => void
  hideAdd?: boolean
}

interface SelectColorItemProps {
  color?: string
  isAdd?: boolean
  icon?: React.ReactNode
  selected: boolean
  onClick?: (color?: string) => void
  size?: 'small' | 'medium' | 'large'
}

const PALETTE = ['#333', '#666', '#999']

export const SelectColorItem: React.FC<SelectColorItemProps> = ({
  color,
  isAdd,
  icon,
  selected,
  size,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // prevent the click from reaching the backdrop!
    e.stopPropagation();
    onClick?.(color);
  };
  
  return (
    <div
      className={classNames(
        styles.colorCircle,
        styles[size + 'Size'],
        selected && styles.selected,
        isAdd && styles.addCircle
      )}
      style={!isAdd ? { backgroundColor: color } : undefined}
      onClick={handleClick}
    >
      {isAdd && icon}
    </div>
  )
}

const SelectColor: React.FC<SelectColorProps> = ({
  colors: initialColors,
  defaultSelected,
  onChange,
  size = 'medium',
  hideAdd = false,
  addIcon = '+',
  onAddClick,
}) => {
  const [colors, setColors] = useState(initialColors)
  const [selected, setSelected] = useState(defaultSelected || initialColors[0])
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    console.log('modal open state changed:', isModalOpen)
  }, [isModalOpen])

  const handleSelect = (c: string) => {
    setSelected(c)
    onChange(c)
  }

  const handleAdd = () => {
    if (onAddClick) return onAddClick()
    setModalOpen(true)
  }

  const handleModalPick = (newColor: string) => {
    setModalOpen(false)
    setColors((prev) => [...prev, newColor])
    handleSelect(newColor)
  }

  return (
    <div className={styles.container}>
      {colors.map((c) => (
        <SelectColorItem
          key={c}
          color={c}
          size={size}
          selected={selected === c}
          onClick={() => handleSelect(c)}
        />
      ))}

      {!hideAdd && (
        <SelectColorItem
          isAdd
          icon={addIcon}
          size={size}
          selected={false}
          onClick={handleAdd}
        />
      )}

      
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <SelectColor
          colors={PALETTE}
          onChange={handleModalPick}
          size={size}
          hideAdd
        />
      </Modal>
    </div>
  )
}

export default SelectColor
