import React, { useEffect, useState } from 'react'
import styles from './ButtonSelect.module.css'
import { FormattedMessage } from 'react-intl'

export type ButtonOptionsType<T extends string = string> = {
  label: string | React.ReactNode
  value: T
  disabled?: boolean
}
interface ButtonSelectProps<T extends string = string> {
  options: ButtonOptionsType<T>[]
  defaultSelected?: T
  onChange?: (value: T) => void
}

export const ButtonSelect = <T extends string = string>({
  options,
  defaultSelected,
  onChange,
}: ButtonSelectProps<T>) => {
  const [selected, setSelected] = useState<T>((defaultSelected ?? options[0].value) as T)
  useEffect(() => {
    setSelected((defaultSelected ?? options[0].value) as T)
  }, [defaultSelected, options])
  const handleSelect = (option: T) => {
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
