// components/ProductCatalog/ProductCatalog.tsx
import React from 'react'
import { CatalogGrid } from '~/components/CatalogGrid/CatalogGrid'
import { products } from '~/components/ProductListPage/products'
import { ProductItem } from '~/components/ProductItem/ProductItem'
import { useCart } from '~/context/cartContext'
import { WardrobeProductConfigurator } from '~/components/ProductPage/productTypes/wardrobe'
import { ProductSectionPredefinedValue } from '~/components/ProductPage/productTypeComponents/wardrobe/ProductSections'
import { CartPredefinedValue } from '~/components/ProductPage/productTypeComponents/CartProductComponents'

export const ProductCatalog: React.FC = () => {
  const { addItem } = useCart()
  const baseConfig = WardrobeProductConfigurator()

  const handleAddToCart = (product: (typeof products)[number]) => {
    addItem(product.name, baseConfig, {
      imageCarousel: product.imageCarousel,
      colors: product.color,
      dimensions: product.dimensions,
      furniture: product.furniture,
      sections:
        typeof product.sections === 'object'
          ? (product.sections as ProductSectionPredefinedValue)
          : undefined,
      price: product.price,
    } as CartPredefinedValue)
  }

  return (
    <CatalogGrid
      items={products}
      getKey={(p) => p.id}
      onAdd={handleAddToCart}
      renderCard={(product, button) => (
        <ProductItem
          name={product.name}
          image={product.src}
          link={product.link}
          dimensions={product.dimensions}
          color={product.color}
          price={product.price}
          button={button}
        />
      )}
    />
  )
}
