import React from 'react'
import styles from './ReviewList.module.css'
import { Review } from './reviewTypes'
import { ReviewSummary, ReviewSummaryProps } from './ReviewSummary'
import { ReviewCard } from './ReviewCard'

export interface ReviewListProps {
  summary: ReviewSummaryProps
  reviews: Review[]
}

export const ReviewList: React.FC<ReviewListProps> = ({ summary, reviews }) => {
  return (
    <section className={styles.root}>
      <div className={styles.summaryColumn}>
        <ReviewSummary {...summary} />
      </div>

      <div className={styles.cardsColumn}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}
