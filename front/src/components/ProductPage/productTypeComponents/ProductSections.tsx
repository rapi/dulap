import React, { FC } from 'react'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { wardrobeOptions } from '~/components/ProductWardrobe/ProductWardrobe'
import { ImageSelect } from '~/components/ImageSelect/ImageSelect'
export type ProductSectionsComponent = {
  type: 'sections'
  maxNumber: number
}
interface ProductSelectProps {
  configuration: ProductSectionsComponent
}
export const ProductSections: FC<ProductSelectProps> = () => {
  return (
    <div>
      <p>Aranjare dulap</p>
      <label>
        <p>Numărul de secții</p>
        <ButtonSelect
          options={wardrobeOptions}
          defaultSelected={'4 secții'}
          onChange={() => {}}
        />
      </label>

      <label>
        <p>Aranjare rafturi</p>
        <ImageSelect
          images={[
            '/wardeobe/1.svg',
            '/wardeobe/2.svg',
            '/wardeobe/3.svg',
            '/wardeobe/4.svg',
          ]}
          onChange={() => {}}
          defaultSelected={1}
        />
      </label>
    </div>
  )
}
