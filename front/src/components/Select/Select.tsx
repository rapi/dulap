import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect from '@mui/material/Select'
import * as React from 'react'
import styles from './Select.module.css'
interface SelectProps {
  options: string[]
  label?: string
}

export const Select = ({ options }: SelectProps) => {
  const [selected, setSelected] = useState(options[0])
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <MuiSelect
        value={selected}
        onChange={(event) => {
          setSelected(event.target.value)
        }}
        displayEmpty
        className={styles.select}
        sx={{
          height: 36,
          fontSize: "12px",
          fontFamily: "Onest, sans-serif",
        }}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <span 
              className={styles.selectOption}
              style={{ fontFamily: "Onest, sans-serif", fontSize: "12px" }}
            >
              {option}
            </span>
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}

export default Select
