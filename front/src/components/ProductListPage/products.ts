export type Dimension = {
  width: number
  height: number
  depth: number
  plintHeight: number
}

export type Section = {
  src: string
  width: number
  height: number
}

export type SectionWardrobe = {
  number: number
  mirror: string
  arrangement: Section[]
  opening: Section[]
}

export type FurnitureConfig = {
  openingType: 'maner' | 'push'
  hinges?:
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
  sections?: number | SectionWardrobe
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
      plintHeight: 5,
    },
    color: '#ded9d3',
    price: 8530,

    imageCarousel: ['/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png'],
    furniture: {
      openingType: 'maner',
      hinges: 'homepage.configurator.fittings.hinges.options.1',
      guides: 'homepage.configurator.fittings.guides.options.1',
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
      plintHeight: 2,
    },
    color: '#fcfbf5',
    price: 3220,

    imageCarousel: ['/wardrobe/White/maner/Base 20/H2100/right/500-1.png'],
    furniture: {
      openingType: 'maner',
      hinges: 'homepage.configurator.fittings.hinges.options.1',
      guides: 'homepage.configurator.fittings.guides.options.1',
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
      plintHeight: 6,
    },
    color: '#9c9c9c',
    price: 11810,

    imageCarousel: ['/wardrobe/Grey/maner/Base 60/H2400/right/2000-4.png'],
    furniture: {
      openingType: 'maner',
      hinges: 'homepage.configurator.fittings.hinges.options.1',
      guides: 'homepage.configurator.fittings.guides.options.1',
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
      plintHeight: 2,
    },
    color: '#d6d6d6',
    price: 16990,

    imageCarousel: ['/wardrobe/Light Grey/push/Base 20/H2400/right/2500-5.png'],
    furniture: {
      openingType: 'push',
      hinges: 'homepage.configurator.fittings.hinges.options.1',
      guides: 'homepage.configurator.fittings.guides.options.1',
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
          src: '/wardrobe/filling/Light Grey/2100/2.png',
          width: 96,
          height: 224,
        },
        {
          src: '/wardrobe/filling/Light Grey/2100/4.png',
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
  // STANDS
  {
    id: '1',
    name: 'products.stand.1.name',
    link: '/product/stand/1',
    src: '/stand/Biege/push/Base 20/H700/S4/800.png',
    dimensions: {
      width: 90,
      height: 70,
      depth: 40,
      plintHeight: 2,
    },
    color: '#d6d6d6',
    price: 5640,

    imageCarousel: [
      '/stand/Biege/push/Base 20/H700/S4/800.png',
    ],
    furniture: {
      openingType: 'push',
      hinges: 'homepage.configurator.fittings.hinges.options.1',
      guides: 'homepage.configurator.fittings.guides.options.1',
    },
    sections: 4,
  },
  {
    id: '2',
    name: 'products.stand.2.name',
    link: '/product/stand/2',
    src: '/stand/White/maner/Base 20/H900/S3/600.png',
    dimensions: {
      width: 50,
      height: 110,
      depth: 40,
      plintHeight: 2
    },
    color: '#fcfbf5',
    price: 4050,

    imageCarousel: [
      '/stand/Biege/push/Base 20/H700/S4/800.png',
    ],
    furniture: {
      openingType: 'maner',
      guides: 'homepage.configurator.fittings.guides.options.1',
    },
    sections: 3,
  },
    // TV STANDS
  {
    id: '1',
    name: 'products.tvstand.1.name',
    link: '/product/tv-stand/1',
    src: '/tv-stand/Grey/push/Base 20/H300/2000-4.png',
    dimensions: {
      width: 200,
      height: 35,
      depth: 40,
      plintHeight: 2
    },
    color: '#9c9c9c',
    price: 7900,

    imageCarousel: [
      '/tv-stand/Grey/push/Base 20/H300/2000-4.png',
    ],
    furniture: {
      openingType: 'push',
      guides: 'homepage.configurator.fittings.guides.options.1',
    },
    sections: 4,
  },
  {
    id: '2',
    name: 'products.tvstand.2.name',
    link: '/product/tv-stand/2',
    src: '/tv-stand/Light Grey/maner/Base 60/H400/1600-2.png',
    dimensions: {
      width: 150,
      height: 45,
      depth: 40,
      plintHeight: 6
    },
    color: '#fcfbf5',
    price: 5100,

    imageCarousel: [
      '/tv-stand/Light Grey/maner/Base 60/H400/1600-2.png',
    ],
    furniture: {
      openingType: 'maner',
      guides: 'homepage.configurator.fittings.guides.options.1',
    },
    sections: 2,
  },
    // BEDSIDES
  {
    id: '1',
    name: 'products.bedside.1.name',
    link: '/product/bedside/1',
    src: '/bedside/Biege/push/Base 20/H300/800.png',
    dimensions: {
      width: 80,
      height: 30,
      depth: 40,
      plintHeight: 2
    },
    color: '#d6d6d6',
    price: 2800,

    imageCarousel: [
      '/bedside/Biege/push/Base 20/H300/800.png',
    ],
    furniture: {
      openingType: 'push',
      guides: 'homepage.configurator.fittings.guides.options.1',
    },
  },
  {
    id: '2',
    name: 'products.bedside.2.name',
    link: '/product/bedside/2',
    src: '/bedside/White/maner/Base 20/H400/600.png',
    dimensions: {
      width: 60,
      height: 50,
      depth: 40,
      plintHeight: 2
    },
    color: '#d6d6d6',
    price: 3180,

    imageCarousel: [
      '/bedside/White/maner/Base 20/H400/600.png',
    ],
    furniture: {
      openingType: 'maner',
      guides: 'homepage.configurator.fittings.guides.options.1',
    },
  },
]