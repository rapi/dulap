export type Dimension = {
  width: number
  height: number
  depth: number
  plintheight: number
}

export type Section = {
  src: string
  width: number
  height: number
}

export type FurnitureConfig = {
  openingType: 'maner' | 'push'
  hinges:
    | 'homepage.configurator.fittings.hinges.options.1'
    | 'homepage.configurator.fittings.hinges.options.2'
  guides:
    | 'homepage.configurator.fittings.guides.options.1'
    | 'homepage.configurator.fittings.guides.options.2'
}

export type Product = {
  id: string
  name: string
  link: string
  src: string
  dimensions: Dimension
  color: string
  price: number

  imageCarousel: string[]
  furniture: FurnitureConfig
  sections: {
    number: number
    mirror: string
    arrangement: Section[]
    opening: Section[]
  }
}

export const products: Product[] = [
  {
    id: '1',
    name: 'products.wardrobe.1.name',
    link: '/product/wardrobe/1',
    src: '/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png',
    dimensions: {
      width: 150,
      height: 210,
      depth: 50,
      plintheight: 5,
    },
    color: '#ded9d3',
    price: 5950,

    imageCarousel: ['/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png'],
    furniture: {
      openingType: 'maner',
      hinges: 'homepage.configurator.fittings.hinges.options.2',
      guides: 'homepage.configurator.fittings.guides.options.2',
    },
    sections: {
      number: 2,
      mirror: 'nu',
      arrangement: [
        { src: '/wardrobe/filling/Biege/2100/1.png', width: 100, height: 210 },
        { src: '/wardrobe/filling/Biege/2100/1.png', width: 50, height: 210 },
      ],
      opening: [
        { src: '/wardrobe/opening-left.png', width: 50, height: 224 },
        { src: '/wardrobe/opening-right.png', width: 50, height: 224 },
        { src: '/wardrobe/opening-right.png', width: 50, height: 224 },
      ],
    },
  },
  {
    id: '2',
    name: 'products.wardrobe.2.name',
    link: '/product/wardrobe/2',
    src: '/wardrobe/White/maner/Base 20/H2100/right/500-1.png',
    dimensions: {
      width: 50,
      height: 210,
      depth: 50,
      plintheight: 2,
    },
    color: '#fcfbf5',
    price: 3900,

    imageCarousel: ['/wardrobe/White/maner/Base 20/H2100/right/500-1.png'],
    furniture: {
      openingType: 'maner',
      hinges: 'homepage.configurator.fittings.hinges.options.2',
      guides: 'homepage.configurator.fittings.guides.options.2',
    },
    sections: {
      number: 1,
      mirror: 'nu',
      arrangement: [
        {
          src: '/wardrobe/filling/White/2100/1.png',
          width: 50,
          height: 210,
        },
      ],
      opening: [
        {
          src: '/wardrobe/opening-right.png',
          width: 50,
          height: 224,
        },
      ],
    },
  },
  {
    id: '3',
    name: 'products.wardrobe.3.name',
    link: '/product/wardrobe/3',
    src: '/wardrobe/Grey/maner/Base 60/H2400/right/2000-4.png',
    dimensions: {
      width: 200,
      height: 240,
      depth: 50,
      plintheight: 6,
    },
    color: '#9c9c9c',
    price: 11700,

    imageCarousel: ['/wardrobe/Grey/maner/Base 60/H2400/right/2000-4.png'],
    furniture: {
      openingType: 'maner',
      hinges: 'homepage.configurator.fittings.hinges.options.2',
      guides: 'homepage.configurator.fittings.guides.options.2',
    },
    sections: {
      number: 2,
      mirror: 'nu',
      arrangement: [
        {
          src: '/wardrobe/filling/Grey/2400/1.png',
          width: 100,
          height: 240,
        },
        {
          src: '/wardrobe/filling/Grey/2400/1.png',
          width: 100,
          height: 240,
        },
      ],
      opening: [
        {
          src: '/wardrobe/opening-double.png',
          width: 100,
          height: 254,
        },
        {
          src: '/wardrobe/opening-double.png',
          width: 100,
          height: 254,
        },
      ],
    },
  },
  {
    id: '4',
    name: 'products.wardrobe.4.name',
    link: '/product/wardrobe/4',
    src: '/wardrobe/Light Grey/push/Base 20/H2400/right/2500-5.png',
    dimensions: {
      width: 240,
      height: 260,
      depth: 50,
      plintheight: 2,
    },
    color: '#d6d6d6',
    price: 13600,

    imageCarousel: ['/wardrobe/Light Grey/push/Base 20/H2400/right/2500-5.png'],
    furniture: {
      openingType: 'push',
      hinges: 'homepage.configurator.fittings.hinges.options.2',
      guides: 'homepage.configurator.fittings.guides.options.2',
    },
    sections: {
      number: 3,
      mirror: 'nu',
      arrangement: [
        {
          src: '/wardrobe/filling/Light Grey/2100/1.png',
          width: 96,
          height: 224,
        },
        {
          src: '/wardrobe/filling/Light Grey/2100/1.png',
          width: 96,
          height: 224,
        },
        {
          src: '/wardrobe/filling/Light Grey/2100/1.png',
          width: 48,
          height: 224,
        },
      ],
      opening: [
        {
          src: '/wardrobe/opening-double.png',
          width: 96,
          height: 254,
        },
        {
          src: '/wardrobe/opening-double.png',
          width: 96,
          height: 254,
        },
        {
          src: '/wardrobe/opening-right.png',
          width: 48,
          height: 254,
        },
      ],
    },
  },
]