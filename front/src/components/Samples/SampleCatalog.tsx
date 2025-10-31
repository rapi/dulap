// components/SampleCatalog/SampleCatalog.tsx
import React from 'react'
import { CatalogGrid } from '~/components/CatalogGrid/CatalogGrid'
import { Sample, SampleItem } from '~/components/Samples/SampleItem'
import { useCart } from '~/context/cartContext'

type SampleCatalogProps = {
  samples: Sample[]
  makeLink?: (s: Sample) => string
}

export const SampleCatalog: React.FC<SampleCatalogProps> = ({
  samples,
  makeLink = (s) => `/samples/${s.id}`,
}) => {
  const { addItem } = useCart()

  const handleAddToCart = (sample: Sample) => {
    // Using the new overload for samples
    addItem(sample.name, {
      id: sample.id,
      color: sample.color,
      price: sample.price,
      imageCarousel: sample.imageCarousel,
    })
  }

  return (
    <CatalogGrid
      items={samples}
      getKey={(s) => s.id}
      onAdd={handleAddToCart}
      renderCard={(sample, button) => (
        <SampleItem sample={sample} link={makeLink(sample)} button={button} />
      )}
    />
  )
}
