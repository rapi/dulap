import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import classes from './ProductItem.module.css'
import { FormattedMessage } from 'react-intl'
import { Dimension } from '../ProductListPage/products'

interface ProductItemProps {
  button: React.ReactNode
  image: string
  name: string
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
    <div className={classes.productItemContainer}>
      <Link href={link}>
        <Image
          width={2056}
          height={1000}
          src={image}
          alt="Comodă"
          className={classes.productImage}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
        />
      </Link>
      <div className={classes.productDescription}>
        <div className={classes.titleRow}>
          <a className={classes.productName} href={link}>
            <h3 className={classes.productName}>
              <FormattedMessage id={name} />
            </h3>
          </a>
        </div>
        <div className={classes.productDescriptionSecondLine}>
          {dimensions ? (
            <p className={classes.dimensions}>{dimensions.width}x{dimensions.height}x{dimensions.depth} cm</p>
          ) : (
            ''
          )}
          <div className={classes.priceAndCTA}>
            <p className={classes.price}>
              {price ? price : ''}&nbsp;
              <FormattedMessage
                id={'homepage.configurator.price.currencyLei'}
              />
            </p>
            {button}
          </div>
        </div>
      </div>
    </div>
  )
}
