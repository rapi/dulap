import React, { useEffect, useState } from 'react'
import styles from './ButtonSelect.module.css'
import { FormattedMessage } from 'react-intl'

export type ButtonOptionsType = {
  label: string | React.ReactNode
  value: string
  disabled?: boolean
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
        <div
          key={option.value}
          className={`
            ${styles.button} 
            ${selected === option.value ? styles.selected : ''}
            ${option.disabled ? styles.disabled : ''}
          `}
          onClick={() => handleSelect(option.value)}
        >
          {typeof option.label === 'string' ? (
            <FormattedMessage id={option.label} />
          ) : (
            option.label
          )}

        </div>
      ))}
    </div>
  )
}
