import React, { FC } from 'react'
import SelectColor from '~/components/SelectColor/SelectColor'
export type ProductColorsComponent = {
  type: 'colors'
  colors: string[]
}
interface ProductColorsProps {
  configuration: ProductColorsComponent
}
export const ProductColors: FC<ProductColorsProps> = ({ configuration }) => {
  return (
    <>
      <h3>Culori</h3>
      <SelectColor
        colors={configuration.colors}
        onChange={() => {}}
        defaultSelected={configuration.colors[0]}
        size="large"
      />
    </>
  )
}
