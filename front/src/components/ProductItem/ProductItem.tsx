import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import classes from './ProductItem.module.css'
import SelectColor from '~/components/SelectColor/SelectColor'
import { FormattedMessage } from 'react-intl'

interface ProductItemProps {
  button: React.ReactNode
  image: string
  name: string
  link: string
}
export const ProductItem: React.FC<ProductItemProps> = ({
  button,
  image,
  name,
  link
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
        <a className={classes.productName} href="">
          <h3 className={classes.productName}><FormattedMessage id={name}/></h3>
        </a>
        <div className={classes.productDescriptionSecondLine}>
          <SelectColor
            colors={['#eeeeee', '#b5b5b5', '#d7d0c5']}
            onChange={() => {}}
            size='medium'
          />
          {button}
        </div>
      </div>
    </div>
  )
}
