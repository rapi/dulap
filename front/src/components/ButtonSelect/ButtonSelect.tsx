import React, { useState } from 'react'
import styles from './ButtonSelect.module.css'

interface ButtonSelectProps {
  options: string[]
  defaultSelected?: string
  onChange?: (value: string) => void
}

export const ButtonSelect: React.FC<ButtonSelectProps> = ({
  options,
  defaultSelected,
  onChange,
}) => {
  const [selected, setSelected] = useState(defaultSelected || options[0])

  const handleSelect = (option: string) => {
    setSelected(option)
    if (onChange) {
      onChange(option)
    }
  }

  return (
    <div className={styles.container}>
      {options.map((option) => (
        <button
          key={option}
          className={`${styles.button} ${selected === option ? styles.selected : ''}`}
          onClick={() => handleSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
