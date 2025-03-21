import { useState } from 'react'
import styles from './ImageSelect.module.css'

export type ImageOptionProps = {
  src: string
  width?: number
  height?: number
}
interface ImageSelectProps {
  images: ImageOptionProps[]
  defaultSelected: number
  gap?: number
  onChange: (index: number | null) => void
}

export const ImageSelect = ({
  images,
  onChange,
  defaultSelected,
  gap,
}: ImageSelectProps) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected - 1 || 0)

  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    onChange(index)
  }

  return (
    <div className={styles.container} style={{ gap }}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.imageWrapper} ${selectedIndex === index ? styles.selected : ''}`}
          onClick={() => handleSelect(index)}
        >
          <img
            src={image.src}
            alt={`Option ${index + 1}`}
            className={styles.image}
            style={{
              width: image.width ?? 70,
              height: image.height ?? 210,
            }}
          />
        </div>
      ))}
    </div>
  )
}
