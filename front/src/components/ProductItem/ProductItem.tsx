import Image from 'next/image'
import React from 'react'
import classes from './ProductItem.module.css'
import SelectColor from '~/components/SelectColor/SelectColor'

interface ProductItemProps {
  button: React.ReactNode
  image: string
  name: string
}
export const ProductItem: React.FC<ProductItemProps> = ({
  button,
  image,
  name,
}) => {
  return (
    <div>
      <Image
        width={2056}
        height={1000}
        src={image}
        alt="Comodă"
        className={classes.productImage}
      />
      <div className={classes.productDescription}>
        <h3>{name}</h3>
        <div className={classes.productDescriptionSecondLine}>
          <SelectColor
            colors={['#eeeeee', '#b5b5b5', '#d7d0c5']}
            onChange={() => {}}
          />
          {button}
        </div>
      </div>
    </div>
  )
}
