import React, { useState } from 'react'
import styles from './ButtonSelect.module.css'

export type ButtonOptionsType = {
  label: React.ReactNode | string
  value: string
}
interface ButtonSelectProps {
  options: ButtonOptionsType[]
  defaultSelected?: string
  onChange?: (value: string) => void
}

export const ButtonSelect: React.FC<ButtonSelectProps> = ({
  options,
  defaultSelected,
  onChange,
}) => {
  const [selected, setSelected] = useState(defaultSelected || options[0].value)

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
          key={option.value}
          className={`${styles.button} ${selected === option.value ? styles.selected : ''}`}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
