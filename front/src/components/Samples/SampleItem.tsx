// components/SampleItem/SampleItem.tsx
import React from 'react'
import { CatalogItem } from '../CatalogItem/CatalogItem_old'
import { FormattedMessage } from 'react-intl'

export type Sample = {
  id: string
  name: string
  subtitle?: string
  color: string
  price: number
  imageCarousel?: string[]
}

interface SampleItemProps {
  button: React.ReactNode
  sample: Sample
  link: string
}

export const SampleItem: React.FC<SampleItemProps> = ({
  button,
  sample,
  link,
}) => {
  const cover =
    sample.imageCarousel?.[0] ?? `/products/samples/${sample.id}.png`

  return (
    <CatalogItem
      button={button}
      image={cover}
      link={link}
      isClickable={false}
      price={sample.price}
      alt={sample.name}
      title={sample.name}
      subtitle="samples.subtitle.delivery"
      currencyMessage={
        <FormattedMessage id="homepage.configurator.price.currencyLei" />
      }
    />
  )
}
