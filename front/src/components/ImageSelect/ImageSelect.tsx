import { useState } from 'react'
import styles from './ImageSelect.module.css'

interface ImageSelectProps {
  images: string[]
  defaultSelected: number
  gap?: number
  onChange: (index: number | null) => void
  sectionWidths: string[]
}

export const ImageSelect = ({
  images,
  onChange,
  defaultSelected,
  gap,
  sectionWidths
}: ImageSelectProps) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected - 1 || 0)

  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    onChange(index)
  }

  return (
    <div className={styles.container} style={{ gap }}>
      {images.map((src, index) => (
        <div
          key={index}
          className={`${styles.imageWrapper} ${selectedIndex === index ? styles.selected : ''}`}
          onClick={() => handleSelect(index)}
          style={{ width: sectionWidths[index] || '90px'}}
        >
          <img 
            src={src} 
            alt={`Option ${index + 1}`} 
            className={styles.image}
            style={{ width: sectionWidths[index] || '90px'}} 
          />
        </div>
      ))}
    </div>
  )
}
