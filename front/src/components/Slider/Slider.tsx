import React, { useState, useEffect } from 'react'
import styles from './Slider.module.css'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@mui/material';

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

  // Sync local state when value prop changes
  useEffect(() => {
    setSliderValue(value.toString())
  }, [value])

  // Round value to nearest step
  const roundToStep = (val: number): number => {
    return Math.round((val - min) / step) * step + min
  }

  // Calculate step positions for visual indicators
  const getStepMarks = () => {
    if (step <= 1 || step >= (max - min)) {
      return [] // Don't show marks if step is invalid or too large
    }
    
    const stepCount = Math.floor((max - min) / step)
    // Limit to reasonable number of marks to avoid clutter
    if (stepCount > 50) {
      return [] // Too many steps, don't show marks
    }
    
    const marks: number[] = []
    for (let i = 0; i <= stepCount; i++) {
      marks.push(min + i * step)
    }
    return marks
  }

  const stepMarks = getStepMarks()
  const showMarks = stepMarks.length > 0

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
      // Round to nearest step
      const roundedValue = roundToStep(numValue)
      // Clamp to min/max after rounding
      const clampedValue = Math.max(min, Math.min(max, roundedValue))
      setSliderValue(clampedValue.toString())
  
      if (onChange) {
        onChange(clampedValue)
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
                >
                  <Typography><FormattedMessage id="homepage.configurator.dimensions.cm"/></Typography>
                </InputAdornment>,
          },
          htmlInput: { 
            sx: { fontSize: '0.9rem' } 
          }
        }}
      />
      <div className={styles.sliderWrapper}>
        {showMarks && (
          <div className={styles.stepMarks}>
            {stepMarks.map((markValue, index) => {
              const percentage = ((markValue - min) / (max - min)) * 100
              return (
                <span
                  key={index}
                  className={styles.stepMark}
                  style={{ left: `${percentage}%` }}
                />
              )
            })}
          </div>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number(sliderValue) || value}
          onChange={handleChange}
          className={showMarks ? styles.sliderWithMarks : styles.slider}
        />
      </div>
    </div>
  )
}
