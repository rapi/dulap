import React, { useState } from 'react'
import styles from './Slider.module.css'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

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
        id="filled-size-small" 
        className={styles.valueInput}
        value={sliderValue}
        variant="outlined"
        onChange={handleInputChange}
        onBlur={handleBlur} 
        size="small"
        sx={{
          display: "flex",
          alignItems: "center",
          m: 1, 
          width: "60px",
          backgroundColor: "#fff",
          margin: 0,
          ".MuiOutlinedInput-root": {
            paddingRight: "0px",
            input: {
              fontFamily: "onest",
              height: "30px",
              fontWeight: 480,
              fontSize: 12,
              textAlign: "start",
              paddingLeft: "10px",
              paddingTop: "0",
              paddingBottom: "0"
            }
          }
        }}
        slotProps={{
          input: {
            endAdornment: 
              <InputAdornment 
                position="start"
                sx= {{ 
                  ".MuiTypography-root": {
                    fontFamily: "onest",
                    fontWeight: 300,
                    fontSize: 12
                  }
                }}
                >cm</InputAdornment>,
          },
          htmlInput: { 
            sx: { fontSize: '0.9rem' } 
          }
        }}
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
