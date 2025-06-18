import { useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect from '@mui/material/Select'
import * as React from 'react'
import styles from './Select.module.css'
import { FormattedMessage } from 'react-intl'

interface SelectProps {
  options: string[]
  onChange?: (value: string) => void
  defaultValue?: string
  size?: 'small' | 'large'
}

export const Select = ({
  options,
  onChange,
  defaultValue,
  size = 'large',
}: SelectProps) => {
  const [selected, setSelected] = useState(options[0])

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue)
    }
  }, [defaultValue])

  const formSize = size === 'small' ? 'small' : 'medium'

  const fcClasses = [
    styles.formControl,
    size === 'small' ? styles.formControlSmall : '',
  ].join(' ')

  return (
    <FormControl size={formSize} className={fcClasses}>
      <MuiSelect
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value)
          onChange?.(e.target.value)
        }}
        displayEmpty
        className={styles.select}
        sx={{
          height: 36,
          fontSize: '12px',
          fontFamily: 'Onest, sans-serif',
        }}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            <span
              className={styles.selectOption}
              style={{ fontFamily: 'Onest, sans-serif', fontSize: '12px' }}
            >
              <FormattedMessage id={opt} />
            </span>
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}

export default Select
