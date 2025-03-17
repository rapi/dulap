import { useState } from 'react'
import styles from './Carousel.module.css'

interface CarouselProps {
  images: { src: string; alt: string }[]
  width?: number
}

export const Carousel = ({ images, width }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const setSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={styles.container}>
      <div className={styles.slideContainer} style={width ? { width } : {}}>
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className={styles.image}
        />
      </div>
      <div className={styles.thumbnails}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`${styles.thumbnail} ${
              currentIndex === index ? styles.active : ''
            }`}
            onClick={() => setSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
