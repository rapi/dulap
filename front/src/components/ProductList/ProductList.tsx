import classes from './ProductList.module.css'
import React, { ReactNode } from 'react'

interface ProductListProps {
  children: ReactNode
}

export const ProductList: React.FC<ProductListProps> = ({ children }) => {
  return (
    <div className={classes.productGrid}>
      {React.Children.map(children, (child) => child)}
    </div>
  )
}
