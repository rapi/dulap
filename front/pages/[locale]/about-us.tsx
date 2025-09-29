// import { FC } from 'react'
// import { AboutUs } from '~/components/AboutUs/AboutUs'
// const Product: FC = () => {
//   return <AboutUs />
// }
//
// export default Product

import React, { FC } from 'react'
import { AboutUs } from '~/components/AboutUs/AboutUs'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const Product: FC = () => {
  const { formatMessage } = useIntl()
  const title = formatMessage({
    id: 'meta.aboutUs.title',
  })
  const description = formatMessage({ id: 'meta.description' })

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <main>
        <AboutUs />
      </main>
    </>
  )
}

export default Product
