import { useState } from 'react'
import styles from './Carousel.module.css'

interface CarouselProps {
  images: { src: string; alt: string }[]
}

export const Carousel = ({ images }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const setSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={styles.container}>
      <div className={styles.slideContainer}>
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className={styles.image}
        />
        <button className={styles.prev} onClick={prevSlide}>
          ❮
        </button>
        <button className={styles.next} onClick={nextSlide}>
          ❯
        </button>
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
