import React from 'react'
import styles from './ButtonImageSelect.module.css'

export type ButtonImageOption<T extends string | number = string> = {
  value: T
  /** Text or any ReactNode rendered under the visual */
  label?: React.ReactNode
  /** Main visual (SVG, <img/>, custom component, etc.) */
  content: React.ReactNode
  /** Native title attribute for tooltip */
  title?: string
  disabled?: boolean
}

export interface ButtonImageSelectProps<T extends string | number = string> {
  /** A11y label for the radiogroup */
  ariaLabel?: string
  /** Options to render */
  options: ButtonImageOption<T>[]
  /** Currently selected value */
  value: T
  /** Change handler */
  onChange: (value: T) => void
}

/**
 * Reusable image/button selector with accessible radio semantics.
 * Renders a horizontally scrollable row of options.
 */
export const ButtonImageSelect = <T extends string | number = string>({
  ariaLabel,
  options,
  value,
  onChange,
}: ButtonImageSelectProps<T>) => {
  // pick next enabled option in given direction (+1 or -1)
  const pickNext = (startIndex: number, dir: 1 | -1) => {
    if (options.length === 0) return
    let i = startIndex
    for (let step = 0; step < options.length; step++) {
      i = (i + dir + options.length) % options.length
      if (!options[i].disabled) {
        onChange(options[i].value)
        break
      }
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.row}
        role="radiogroup"
        aria-label={ariaLabel || 'Options'}
      >
        {options.map((opt, idx) => {
          const isSelected = opt.value === value

          const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault()
              pickNext(idx, +1)
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault()
              pickNext(idx, -1)
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!opt.disabled) onChange(opt.value)
            }
          }

          return (
            <button
              key={String(opt.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={opt.disabled || undefined}
              title={opt.title}
              disabled={opt.disabled}
              className={`${styles.item} ${isSelected ? styles.selected : ''} ${
                opt.disabled ? styles.disabled : ''
              }`}
              onClick={() => {
                if (!opt.disabled && !isSelected) onChange(opt.value)
              }}
              onKeyDown={onKeyDown}
            >
              <div className={styles.content}>{opt.content}</div>

              {opt.label && <div className={styles.label}>{opt.label}</div>}

              {isSelected && <div className={styles.checkmark}>✓</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
