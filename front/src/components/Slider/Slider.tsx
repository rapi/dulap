import React, { useState } from 'react'
import styles from './Slider.module.css'
import TextField from '@mui/material/TextField';

interface SliderProps {
  min?: number
  max?: number
  value?: number
  step?: number
  onChange?: (value: number) => void
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 5000,
  value = 2500,
  step = 1,
  onChange,
}) => {
  const [sliderValue, setSliderValue] = useState(value.toString())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    setSliderValue(newValue.toString())

    if (onChange) {
      onChange(newValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(e.target.value)
  }

  const handleBlur = () => {
    const numValue = Number(sliderValue)
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      if (onChange) {
        onChange(numValue)
      }
    } else {
      setSliderValue(value.toString())
    }
  }

  return (
    <div className={styles.sliderContainer}>
      <TextField 
        id="outlined-basic" 
        className={styles.valueInput2}
        value={sliderValue} 
        variant="outlined"
        onChange={handleInputChange}
        onBlur={handleBlur} 
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleChange}
        className={styles.slider}
      />
    </div>
  )
}
