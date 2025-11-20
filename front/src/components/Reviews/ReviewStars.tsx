import React from 'react'
import styles from './ReviewStars.module.css'

export type ReviewStarsSize = 'sm' | 'md' | 'lg'

export interface ReviewStarsProps {
  rating: number // 0–5, decimals allowed
  size?: ReviewStarsSize
  ariaLabel?: string
}

export const ReviewStars: React.FC<ReviewStarsProps> = ({
  rating,
  size = 'md',
  ariaLabel,
}) => {
  const clampedRating = Math.max(0, Math.min(5, rating))
  const percentage = (clampedRating / 5) * 100

  const sizeClass =
    size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd

  return (
    <span
      className={`${styles.wrapper} ${sizeClass}`}
      role="img"
      aria-label={ariaLabel ?? `${clampedRating.toFixed(1)} out of 5 stars`}
    >
      <span className={styles.base}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={styles.star}>
            ★
          </span>
        ))}
      </span>
      <span className={styles.fill} style={{ width: `${percentage}%` }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={styles.star}>
            ★
          </span>
        ))}
      </span>
    </span>
  )
}
