import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styles from './ReviewSummary.module.css'
import { ReviewStars } from './ReviewStars'
import { useRouter } from 'next/router'

export interface ReviewSummaryProps {
  averageRating: number
  maxRating?: number
  recommendedPercentage: number
  totalReviews: number
  sourceLabel?: string
  learnMoreLabel?: string
  onLearnMoreClick?: () => void
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  averageRating,
  maxRating = 5,
  learnMoreLabel,
}) => {
  const intl = useIntl()
  const router = useRouter()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (onLearnMoreClick) {
      onLearnMoreClick()
    }
  }

  const onLearnMoreClick = () => router.push('/reviews')


  const learnMoreText =
    learnMoreLabel ?? intl.formatMessage({ id: 'reviews.summary.learnMore' })


  return (
    <aside className={styles.card}>
      <div className={styles.scoreRow}>
        <span className={styles.scoreValue}>{averageRating.toFixed(1)}</span>
        <span className={styles.scoreMax}>/{maxRating}</span>
      </div>

      <div className={styles.starsRow}>
        <ReviewStars rating={averageRating} size="lg" />
      </div>

      <p className={styles.text}>
        <FormattedMessage
          id="reviews.summary.recommended"
        />
        <br />
      </p>

      <button
        type="button"
        className={styles.learnMoreButton}
        onClick={handleClick}
      >
        {learnMoreText}
      </button>
    </aside>
  )
}
