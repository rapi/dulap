import React, { useState } from 'react'
import styles from './SelectColor.module.css'
import classNames from 'classnames'

interface SelectColorProps {
  colors: string[]
  defaultSelected?: string
  onChange: (color: string) => void
  size?: 'small' | 'medium' | 'large'
}

const SelectColor: React.FC<SelectColorProps> = ({
  colors,
  defaultSelected,
  onChange,
  size = 'medium',
}) => {
  const [selectedColor, setSelectedColor] = useState(defaultSelected || colors[0])

  const handleSelect = (color: string) => {
    setSelectedColor(color)
    onChange(color)
  }
  return (
    <div className={styles.container}>
      {colors.map((color, index) => (
        <div
          key={index}
          className={classNames([
            styles.colorCircle,
            selectedColor === color && styles.selected,
            styles[size + 'Size'],
          ])}
          style={{ backgroundColor: color }}
          onClick={() => handleSelect(color)}
        />
      ))}
    </div>
  )
}

export default SelectColor
