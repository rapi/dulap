type ProductCard = {
  name: string
  link: string
  src: string
  dimensions: string
  color: string
  price: number
}
export const products: ProductCard[] = [
  {
    name: 'products.wardrobe.1.name',
    link: '/product/wardrobe/1',
    src: '/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png',
    dimensions: '150x210x50',
    color: '#ded9d3',
    price: 5950,
  },
  {
    name: 'products.wardrobe.2.name',
    link: '/product/wardrobe/2',
    src: '/wardrobe/White/maner/Base 20/H2100/right/500-1.png',
    dimensions: '50x210x50',
    color: '#fcfbf5',
    price: 3900,
  },
  {
    name: 'products.wardrobe.3.name',
    link: '/product/wardrobe/3',
    src: '/wardrobe/Grey/maner/Base 60/H2400/right/2000-4.png',
    dimensions: '200x240x50',
    color: '#9c9c9c',
    price: 11700,
  },
  {
    name: 'products.wardrobe.4.name',
    link: '/product/wardrobe/4',
    src: '/wardrobe/Light Grey/push/Base 20/H2400/right/2500-5.png',
    dimensions: '240x260x50',
    color: '#d6d6d6',
    price: 13600,
  },
]
