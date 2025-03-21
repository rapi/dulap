import React, { useEffect, useState } from 'react'
import styles from './ButtonSelect.module.css'

export type ButtonOptionsType = {
  label: React.ReactNode | string
  value: string
}
interface ButtonSelectProps {
  options: ButtonOptionsType[]
  defaultSelected?: string
  onChange?: (value: string) => void
  minActiveNumber: string
}

export const ButtonSelect: React.FC<ButtonSelectProps> = ({
  options,
  defaultSelected,
  onChange,
  minActiveNumber
}) => {
  const [selected, setSelected] = useState(defaultSelected || options[0].value)
  const activeNumberStart = minActiveNumber
  useEffect(() => {
    setSelected(defaultSelected || options[0].value)
  }, [defaultSelected, options])
  const handleSelect = (option: string) => {
    setSelected(option)
    if (onChange) {
      onChange(option)
    }
  }

  return (
    <div className={styles.container}>
      {options.map((option) => (
        console.log('test', activeNumberStart),
        <div
          key={option.value}
          className={`
            ${styles.button} 
            ${selected === option.value ? styles.selected : ''}
            ${parseInt(activeNumberStart) > parseInt(option.value) ? styles.disabled : ''}
          `}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  )
}
