import React, { FC } from 'react'
import { ReviewListPage } from '~/components/Reviews/ReviewListPage'
import ReviewsSection from '~/components/Reviews/ReviewsSection'
export { Reviews } from '~/components/Reviews/reviews'

const Reviews: FC = () => {
  return (
    <>
      <main>
        <ReviewListPage>
            <ReviewsSection />
        </ReviewListPage>
      </main>
    </>
  )
}

export default Reviews
