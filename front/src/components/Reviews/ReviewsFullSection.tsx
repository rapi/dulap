import React from 'react'
import { ReviewList } from './ReviewList'
import { reviews } from './reviews'

const ReviewsSection: React.FC = () => {
  return (
    <ReviewList
      summary={{
        averageRating: 5.0,
        recommendedPercentage: 96,
        totalReviews: 2285,
        sourceLabel: 'collected at dulap.md',
      }}
      reviews={reviews}
    />
  )
}

export default ReviewsSection
