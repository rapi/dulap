import React, { FC } from 'react'
import Select from '~/components/Select/Select'
export type ProductSelectComponent = {
  type: 'select'
  title: string
  subTitle: string
  options: string[]
  predefinedValue?: string
}
interface ProductSelectProps {
  configuration: ProductSelectComponent
  predefinedValue?: string
}
export const ProductSelect: FC<ProductSelectProps> = ({ configuration }) => {
  return (
    <>
      <h3>{configuration.title}</h3>
      <label>
        <Select
          label={configuration.subTitle}
          options={configuration.options}
        />
      </label>
    </>
  )
}
