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
  predefinedValue?: string
}
export const ProductImageSelect: FC<ProductImageSelectProps> = ({
  configuration,
  predefinedValue,
}) => {
  return predefinedValue ? (
    <img alt="" src={predefinedValue} />
  ) : (
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
