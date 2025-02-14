import Image from 'next/image'
import React from 'react'
import classes from './ProductItem.module.css'

interface ProductItemProps {
  button: React.ReactNode
}
export const ProductItem: React.FC<ProductItemProps> = ({ button }) => {
  return (
    <div>
      <Image
        width={2056}
        height={1000}
        src="/sideboard.jpg"
        alt="Comodă"
        className={classes.productImage}
      />
      <div className={classes.productDescription}>
        <h3>Comodă pe picioare</h3>
        <div className={classes.productDescriptionSecondLine}>
          <div className={classes.colorSelectionGrid}>
            <span className={classes.colorItem}></span>
            <span className={classes.colorItem2}></span>
            <span className={classes.colorItem3}></span>
          </div>
          {button}
        </div>

        
      </div>
      
    </div>
  )
}
