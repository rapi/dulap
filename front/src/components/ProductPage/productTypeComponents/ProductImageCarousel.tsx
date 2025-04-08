import React, { FC } from 'react'
import { Carousel } from '~/components/Carousel/Carousel'
import classes from '~/components/ProductPageLayout/ProductPageLayout.module.css'
export type ProductImageCarouselComponent = {
  type: 'imageCarousel'
  images: string[]
}
interface ProductImageCarouselProps {
  configuration: ProductImageCarouselComponent
}
export const ProductImageCarousel: FC<ProductImageCarouselProps> = ({
  configuration: { images },
}) => {
  return (
    <div className={classes.productImageCarousel}>
      <Carousel
        images={images.map((image) => ({
          src: image,
          alt: image,
        }))}
      />
    </div>
  )
}
