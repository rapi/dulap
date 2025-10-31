import React, { FC } from 'react'
import { Gallery } from '~/components/Gallery/Gallery'
import classes from '~/components/ProductPageLayout/ProductPageLayout.module.css'

export type ProductGalleryComponent = {
  type: 'gallery'
  predefinedValue?: string
  images: string[]
}

interface ProductGalleryProps {
  configuration: ProductGalleryComponent
}

export const ProductGallery: FC<ProductGalleryProps> = ({
  configuration: { images },
}) => {
  return (
    <div className={classes.productGallery}>
      <Gallery
        images={images.map((image) => ({
          src: image,
          alt: image,
        }))}
      />
    </div>
  )
}
