import classes from './ProductList.module.css'
import React, { ReactNode } from 'react'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'
import animationStyles from '~/styles/animations.module.css'

interface ProductListProps {
  children: ReactNode
}

export const ProductList: React.FC<ProductListProps> = ({ children }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={classes.productGrid}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child
        
        return (
          <div
            className={isVisible ? animationStyles.fadeInUp : classes.productItem}
            style={{ animationDelay: isVisible ? `${index * 0.1}s` : undefined }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
