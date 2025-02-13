import Image from 'next/image'
import React from 'react'
interface ProductItemProps {
  button: React.ReactNode
}
export const ProductItem: React.FC<ProductItemProps> = ({ button }) => {
  return (
    <div>
      <Image
        width={2056}
        height={1000}
        src="/banner.jpg"
        alt="Comodă"
        className="productImage"
      />
      <h3>Comodă pe picioare</h3>

      {button}
    </div>
  )
}
