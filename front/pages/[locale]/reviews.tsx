import React, { FC } from 'react'
import { ReviewListPage } from '~/components/Reviews/ReviewListPage'
import ReviewsFullSection from '~/components/Reviews/ReviewsFullSection'

const Reviews: FC = () => {
  return (
    <>
      <main>
        <ReviewListPage>
          <ReviewsFullSection />
        </ReviewListPage>
      </main>
    </>
  )
}

export default Reviews
