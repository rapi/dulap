import React, { useState } from 'react'
import styles from './SelectColor.module.css'

interface SelectColorProps {
  colors: string[]
  onChange: (color: string) => void
}

const SelectColor: React.FC<SelectColorProps> = ({ colors, onChange }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const handleSelect = (color: string) => {
    setSelectedColor(color)
    onChange(color)
  }

  return (
    <div className={styles.container}>
      {colors.map((color, index) => (
        <div
          key={index}
          className={`${styles.colorCircle} ${
            selectedColor === color ? styles.selected : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={() => handleSelect(color)}
        />
      ))}
    </div>
  )
}

export default SelectColor
