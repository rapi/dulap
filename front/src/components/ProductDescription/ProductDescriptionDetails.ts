const allProductTypes = [
  'homepage.products.wardrobe',
  'homepage.products.stand',
  'homepage.products.tv-stand',
  'homepage.products.bedside',
]

export const ProductDescriptionDetails = [
  {
    title: 'configurator.infobox.quality.title',
    value: [
      {
        productType: allProductTypes,
        content: 'configurator.infobox.quality.1',
      },
    ],
  },
  {
    title: 'configurator.infobox.assembly.title',
    value: [
      {
        productType: allProductTypes,
        content: [
          'configurator.infobox.assembly.1',
          'configurator.infobox.assembly.2',
        ],
      },
    ],
  },
  {
    title: 'configurator.infobox.delivery.title',
    value: [
      {
        productType: allProductTypes,
        content: [
          'configurator.infobox.delivery.1',
          'configurator.infobox.delivery.2',
        ],
      },
    ],
  },
  {
    title: 'configurator.infobox.warranty.title',
    value: [
      {
        productType: allProductTypes,
        content: [
          'configurator.infobox.warranty.1',
          'configurator.infobox.warranty.2',
        ],
      },
    ],
  },
]
