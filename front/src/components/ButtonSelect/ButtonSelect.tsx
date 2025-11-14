import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  size?: 'small' | 'medium'
  className?: string
  autoCenter?: boolean
}

export const ButtonSelect = <T extends string = string>({
  options,
  defaultSelected,
  onChange,
  size = 'small',
  className,
  autoCenter = true,
}: ButtonSelectProps<T>) => {
  const [selected, setSelected] = useState<T>(
    (defaultSelected ?? options[0]?.value) as T
  )

  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Map<T, HTMLDivElement>>(new Map())

  useEffect(() => {
    setSelected((defaultSelected ?? options[0]?.value) as T)
  }, [defaultSelected, options])

  const handleSelect = (option: T) => {
    setSelected(option)
    onChange?.(option)
  }

  // smoother custom scroll animation
  const smoothScrollTo = (el: HTMLElement, to: number, duration = 450) => {
    const start = el.scrollLeft
    const change = to - start
    const startTime = performance.now()
    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      el.scrollLeft = start + change * easeInOutQuad(t)
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const centerSelected = () => {
    if (!autoCenter) return
    const container = containerRef.current
    const el = itemRefs.current.get(selected)
    if (!container || !el) return

    // robust center using rects (handles gaps/padding/positioning)
    const cRect = container.getBoundingClientRect()
    const eRect = el.getBoundingClientRect()

    const current = container.scrollLeft
    const elOffsetInside = eRect.left - cRect.left
    const target =
      current + elOffsetInside - (container.clientWidth - el.clientWidth) / 2

    const max = container.scrollWidth - container.clientWidth
    const next = Math.max(0, Math.min(target, max))

    smoothScrollTo(container, next, 500) // a bit slower = smoother
  }

  // Center after layout (and again right after paint to fight late reflows)
  useLayoutEffect(() => {
    centerSelected()
    const raf = requestAnimationFrame(centerSelected)
    const raf2 = requestAnimationFrame(() => {
      // one more pass in case fonts/i18n caused late width changes
      centerSelected()
    })
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(raf2)
    }
  }, [selected, options, autoCenter])

  // Re-center on container resize
  useEffect(() => {
    const container = containerRef.current
    if (!container || !autoCenter) return
    const ro = new ResizeObserver(() => centerSelected())
    ro.observe(container)
    return () => ro.disconnect()
  }, [autoCenter])

  return (
    <div
      ref={containerRef}
      className={[
        styles.container,
        size === 'medium' ? styles.medium : styles.small,
        className || '',
      ].join(' ')}
    >
      {options.map((option) => (
        <div
          key={option.value}
          ref={(el) => {
            if (el) itemRefs.current.set(option.value, el)
            else itemRefs.current.delete(option.value)
          }}
          className={[
            styles.button,
            selected === option.value ? styles.selected : '',
            option.disabled ? styles.disabled : '',
          ].join(' ')}
          onClick={(e) => {
            e.stopPropagation()
            if (!option.disabled) handleSelect(option.value)
          }}
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
