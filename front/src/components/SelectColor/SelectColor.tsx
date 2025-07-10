import React, { useState, useEffect } from 'react'
import styles from './SelectColor.module.css'
import classNames from 'classnames'
import { Modal } from '~/components/Modal/Modal'
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';
import { FormattedMessage } from 'react-intl'

interface SelectColorProps {
  colors: string[]
  defaultSelected?: string
  onChange: (color: string) => void
  size?: 'small' | 'medium' | 'large'
  addIcon?: React.ReactNode
  onAddClick?: () => void
  showAdd?: boolean
}

interface SelectColorItemProps {
  color?: string
  isAdd?: boolean
  icon?: React.ReactNode
  selected: boolean
  onClick?: (color?: string, e?: React.MouseEvent) => void
  size?: 'small' | 'medium' | 'large'
}

const PALETTE = ['#d7cabc', '#e6d7c2', '#90916f', '#c9d2c1', '#685950', '#847a6e', '#a29587']

export const SelectColorItem: React.FC<SelectColorItemProps> = ({
  color,
  isAdd,
  icon,
  selected,
  size,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(color, e)
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
  showAdd = false,
  addIcon = <AddIcon fontSize='small' sx={{ color: grey[600]}}/>,
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

  const handleAdd = (_c?: string, e?: React.MouseEvent) => {
    if (onAddClick) {
      return onAddClick()
    }
    e?.stopPropagation()
    setTimeout(() => setModalOpen(true), 0)
   }

  const handleModalPick = (newColor: string) => {
    setModalOpen(false)
    setColors([...initialColors, newColor])
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

      {showAdd  && (
        <SelectColorItem
          isAdd
          icon={addIcon}
          size={size}
          selected={false}
          onClick={handleAdd}
        />
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3><FormattedMessage id="selectColor.modal.title"/></h3>
        <div className={styles.modalColorsContainer}>
          <SelectColor
            colors={PALETTE}
            onChange={handleModalPick}
            size='large'
          />
        </div>
        
      </Modal>
    </div>
  )
}

export default SelectColor
