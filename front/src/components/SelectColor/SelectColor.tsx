import React, { useState } from 'react'
import styles from './SelectColor.module.css'
import classNames from 'classnames'

interface SelectColorProps {
  colors: string[]
  defaultSelected?: string
  onChange: (color: string) => void
  size?: 'small' | 'medium' | 'large'
}
interface SelectColorItemProps {
  color: string
  selected: boolean
  onClick?: (color: string) => void
  size?: 'small' | 'medium' | 'large'
}
export const SelectColorItem: React.FC<SelectColorItemProps> = ({
  selected,
  size,
  color,
  onClick,
}) => {
  return (
    <div
      className={classNames([
        styles.colorCircle,
        selected && styles.selected,
        styles[size + 'Size'],
      ])}
      style={{ backgroundColor: color }}
      onClick={() => onClick && onClick(color)}
    />
  )
}
const SelectColor: React.FC<SelectColorProps> = ({
  colors,
  defaultSelected,
  onChange,
  size = 'medium',
}) => {
  const [selectedColor, setSelectedColor] = useState(
    defaultSelected || colors[0]
  )

  const handleSelect = (color: string) => {
    setSelectedColor(color)
    onChange(color)
  }
  return (
    <div className={styles.container}>
      {colors.map((color, index) => (
        <>
          <SelectColorItem
            key={index}
            color={color}
            size={size}
            selected={selectedColor === color}
            onClick={() => handleSelect(color)}
          />
        </>
      ))}
    </div>
  )
}

export default SelectColor
