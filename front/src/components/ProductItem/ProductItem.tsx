// components/ProductItem/ProductItem.tsx
import Image from 'next/image'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Dimension } from '../ProductListPage/products'
import { CatalogItem } from '../CatalogItem/CatalogItem'

interface ProductItemProps {
  button: React.ReactNode
  image: string
  name: string // i18n id
  link: string
  dimensions: Dimension
  color?: string
  price?: number
}

export const ProductItem: React.FC<ProductItemProps> = ({
  button,
  image,
  name,
  link,
  dimensions,
  price,
}) => {
  return (
    <CatalogItem
      button={button}
      image={image}
      link={link}
      dimensions={dimensions}
      price={price}
      alt="Comodă"
      title={<FormattedMessage id={name} />}
      currencyMessage={
        <FormattedMessage id="homepage.configurator.price.currencyLei" />
      }
    />
  )
}
