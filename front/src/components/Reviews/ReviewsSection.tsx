// e.g. src/app/reviews-demo/page.tsx or inside some product page

import React from 'react'
import { ReviewList } from './ReviewList'
import { Review } from './reviewTypes'

const reviews: Review[] = [
  {
    id: '1',
    rating: 5,
    author: 'reviews.list.1.author',
    color: 'reviews.list.1.color',
    dateLabel: 'reviews.list.1.date',
    title: 'reviews.list.1.title',
    body: 'reviews.list.1.body',
    originalLanguageCode: 'ro-RO',
    originalLanguageLabel: 'reviews.list.1.originalLanguageLabel',
    showOriginalLabel: 'reviews.list.1.showOriginalLabel',
    imageUrl: '/front/src/utils/reviews/review_01.png',
    imageAlt: 'reviews.list.1.imageAlt',
  },
  {
    id: '2',
    rating: 5,
    author: 'reviews.list.2.author',
    color: 'reviews.list.2.color',
    dateLabel: 'reviews.list.2.date',
    title: 'reviews.list.2.title',
    body: 'reviews.list.2.body',
    originalLanguageCode: 'RO',
    originalLanguageLabel: 'reviews.list.2.originalLanguageLabel',
    showOriginalLabel: 'reviews.list.2.showOriginalLabel',
    imageUrl: '/images/reviews/review-2.jpg',
    imageAlt: 'reviews.list.2.imageAlt',
  },
  {
    id: '3',
    rating: 5,
    author: 'reviews.list.3.author',
    color: 'reviews.list.3.color',
    dateLabel: 'reviews.list.3.date',
    title: 'reviews.list.3.title',
    body: 'reviews.list.3.body',
    originalLanguageCode: 'RO',
    originalLanguageLabel: 'reviews.list.3.originalLanguageLabel',
    showOriginalLabel: 'reviews.list.3.showOriginalLabel',
    imageUrl: '/images/reviews/review-3.jpg',
    imageAlt: 'reviews.list.3.imageAlt',
  },
]


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
