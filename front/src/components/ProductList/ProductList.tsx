import classes from './ProductList.module.css'
import React, { ReactNode } from 'react'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'
import animationStyles from '~/styles/animations.module.css'
import { useMediaQuery } from '@mui/material'

interface ProductListProps {
  children: ReactNode
}

export const ProductList: React.FC<ProductListProps> = ({ children }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const isMobile = useMediaQuery('(max-width:900px)')

  // 🔑 On mobile, always treat as visible (no scroll dependency)
  const shouldAnimateIn = isMobile ? true : isVisible

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={classes.productGrid}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child

        return (
          <div
            className={
              shouldAnimateIn ? animationStyles.fadeInUp : classes.productItem
            }
            style={{
              animationDelay: shouldAnimateIn ? `${index * 0.1}s` : undefined,
            }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
