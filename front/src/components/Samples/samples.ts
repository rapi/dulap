// samples.ts

export type Sample = {
  id: string
  name: string
  subtitle?: string
  color: string
  price: number
  imageCarousel?: string[]
}

export const samples: Sample[] = [
  {
    id: '01-beige',
    name: 'Beige',
    color: '#f1e0d2',
    price: 0,
  },
  {
    id: '02-white',
    name: 'White',
    color: '#fcfbf5',
    price: 0,
  },
  {
    id: '03-light-grey',
    name: 'Light Grey',
    color: '#d6d6d6',
    price: 0,
  },
  {
    id: '04-grey',
    name: 'Grey',
    color: '#9c9c9c',
    price: 0,
  },
  {
    id: '05-dark-grey',
    name: 'Dark Grey',
    color: '#4b4b4b',
    price: 0,
  },
  {
    id: '06-grey-cubanit',
    name: 'Grey Cubanit',
    color: '#877d73',
    price: 0,
  },
  {
    id: '07-grey-stone',
    name: 'Grey Stone',
    color: '#a29587',
    price: 0,
  },
  {
    id: '08-beige-cashmere',
    name: 'Beige Cashmere',
    color: '#d9c9be',
    price: 0,
  },
  {
    id: '09-beige-sand',
    name: 'Beige Sand',
    color: '#e7d5c3',
    price: 0,
  },
  {
    id: '10-rose-antique',
    name: 'Rose Antique',
    color: '#c39d94',
    price: 0,
  },
  {
    id: '11-beige-almond',
    name: 'Beige Almond',
    color: '#baa397',
    price: 0,
  },
  {
    id: '12-green-salvia',
    name: 'Green Salvia',
    color: '#bdbda6',
    price: 0,
  },
  {
    id: '13-nuc-carini',
    name: 'Natural Walnut',
    color: '-',
    price: 0,
  },
  {
    id: '14-salcam-natur',
    name: 'Natural Acacia',
    color: '-',
    price: 0,
  },
]
