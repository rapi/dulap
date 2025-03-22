import React, { FC } from 'react'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
export type ProductImageSelectComponent = {
  type: 'imageSelect'
  options: {
    value: string
    imageURL: string
  }[]
}
interface ProductImageSelectProps {
  configuration: ProductImageSelectComponent
}
export const ProductImageSelect: FC<ProductImageSelectProps> = ({
  configuration,
}) => {
  return (
    <>
      <ButtonSelect
        options={configuration.options.map((option) => ({
          value: option.value,
          label: (
            <>
              <img alt="" src={option.imageURL} />
            </>
          ),
        }))}
        defaultSelected={configuration.options[0].value}
        onChange={() => {}}
      />
    </>
  )
}
