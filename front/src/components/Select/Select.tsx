import { useState } from 'react'
import styles from './Select.module.css'

interface SelectProps {
  options: string[]
  label?: string
}

export const Select = ({ options, label }: SelectProps) => {
  const [selected, setSelected] = useState(options[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectBox} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.selected}>{selected}</span>
        <span className={styles.arrow}>&#9662;</span>
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li
              key={option}
              className={styles.option}
              onClick={() => {
                setSelected(option)
                setIsOpen(false)
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
