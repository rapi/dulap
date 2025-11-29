// components/CatalogItem/CatalogItem.tsx
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import classes from '../ProductItem/ProductItem.module.css'
import { Dimension } from '../ProductListPage/products'
import { FormattedMessage } from 'react-intl'

type CatalogItemProps = {
  button: React.ReactNode
  image: string
  /** If omitted or isClickable=false, the card won't navigate */
  link?: string
  /** Force clickability; defaults to Boolean(link) */
  isClickable?: boolean
  title: React.ReactNode
  subtitle?: string
  price?: number
  dimensions?: Dimension // optional — pass only for products
  alt?: string
  currencyMessage?: React.ReactNode // e.g. <FormattedMessage id="homepage.configurator.price.currencyLei" />
}

export const CatalogItem: React.FC<CatalogItemProps> = ({
  button,
  image,
  link,
  isClickable,
  title,
  subtitle,
  price,
  dimensions,
  alt = 'Item image',
  currencyMessage,
}) => {
  const clickable =
    typeof isClickable === 'boolean' ? isClickable : Boolean(link)

  const TitleBlock = <h3 className={classes.productName}>{title}</h3>

  return (
    <div className={classes.productItemContainer}>
      {clickable && link ? (
        <Link href={link}>
          <Image
            width={2056}
            height={1000}
            src={image}
            alt={alt}
            className={classes.productImage}
            placeholder="blur"
            // 👇 force eager load to avoid "only after scroll" issue on mobile
            loading="eager"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
          />
        </Link>
      ) : (
        <Image
          width={2056}
          height={1000}
          src={image}
          alt={alt}
          className={classes.productImage}
          placeholder="blur"
          // 👇 same here
          loading="eager"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
        />
      )}

      <div className={classes.productDescription}>
        <div className={classes.titleRow}>
          {clickable && link ? (
            <a className={classes.productName} href={link}>
              {TitleBlock}
            </a>
          ) : (
            TitleBlock
          )}
        </div>

        <div className={classes.productDescriptionSecondLine}>
          {dimensions ? (
            <p className={classes.dimensions}>
              {dimensions.width}x{dimensions.height}x{dimensions.depth} cm
            </p>
          ) : (
            ''
          )}
          {subtitle ? <FormattedMessage id={subtitle} /> : null}

          <div className={classes.priceAndCTA}>
            <p className={classes.price}>
              {typeof price === 'number' ? price : ''}&nbsp;{currencyMessage}
            </p>
            {button}
          </div>
        </div>
      </div>
    </div>
  )
}
