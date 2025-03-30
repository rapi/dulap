import React, { FC } from 'react'
import { Carousel } from '~/components/Carousel/Carousel'
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
    <div>
      <Carousel
        width={600}
        images={images.map((image) => ({
          src: image,
          alt: image,
        }))}
      />
    </div>
  )
}
