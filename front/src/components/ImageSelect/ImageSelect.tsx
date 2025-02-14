import { useState } from 'react'
import styles from './ImageSelect.module.css'

interface ImageSelectProps {
  images: string[]
  onChange: (index: number | null) => void
}

export const ImageSelect = ({ images, onChange }: ImageSelectProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    const newIndex = index === selectedIndex ? null : index
    setSelectedIndex(newIndex)
    onChange(newIndex)
  }

  return (
    <div className={styles.container}>
      {images.map((src, index) => (
        <div
          key={index}
          className={`${styles.imageWrapper} ${selectedIndex === index ? styles.selected : ''}`}
          onClick={() => handleSelect(index)}
        >
          <img src={src} alt={`Option ${index + 1}`} className={styles.image} />
        </div>
      ))}
    </div>
  )
}
