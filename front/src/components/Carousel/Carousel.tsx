import { useState } from 'react'
import styles from './Carousel.module.css'
import Image from 'next/image'

interface CarouselProps {
  images: { src: string; alt: string }[]
  width?: number | string
}

  export const Carousel = ({ images, width = '100%' }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const setSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={styles.container}>
      <div className={styles.slideContainer} style={{ width }}>
        <Image
          width={600}
          height={600}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className={styles.image}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
        />
      </div>
      <div className={styles.thumbnails}>
        {images.map((image, index) => (
          <Image
            width={600}
            height={600}
            key={index}
            src={image.src}
            alt={image.alt}
            className={`${styles.thumbnail} ${
              currentIndex === index ? styles.active : ''
            }`}
            onClick={() => setSlide(index)}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
          />
        ))}
      </div>
    </div>
  )
}
