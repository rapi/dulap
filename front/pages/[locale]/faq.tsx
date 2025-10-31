import React, { FC } from 'react'
import { FAQ } from '~/components/FAQ/FAQ'
import { FAQcontent } from '~/components/FAQ/FAQcontent'

const Product: FC = () => {
  return (
    <>
      <main>
        <FAQ content={FAQcontent} />
      </main>
    </>
  )
}

export default Product
