import * as React from 'react'
import ThankYou from './ThankYou'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage } from 'react-intl'

export default function ThankYouPage() {
  return (
    <ThankYou
      title="order.thankYou"
      subtitle="order.thankYou.subtitle"
      icon={
        <span role="img" aria-label="confetti" style={{ fontSize: 56 }}>
          🎉
        </span>
      }
      actions={
        <>
          <CustomButton href="/">
            <FormattedMessage id="mainPage" />
          </CustomButton>
        </>
      }
    ></ThankYou>
  )
}
