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
  readonly?: boolean
  flipped?: boolean
  effectsEnabled?: boolean
  onChange: (index: number | null) => void
}

export const ImageSelect = ({
  images,
  onChange,
  defaultSelected,
  gap,
  flipped,
  readonly,
  effectsEnabled,
}: ImageSelectProps) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected - 1 || 0)

  const handleSelect = (index: number) => {
    if (!readonly) {
      setSelectedIndex(index)
      onChange(index)
    }
  }

  const displayedImages = flipped ? [...images].reverse() : images

  return (
    <div className={styles.container} style={{ gap }}>
      {displayedImages.map((image, index) => (
        <div
          key={index}
          className={`
            ${styles.imageWrapper} 
            ${selectedIndex === index && effectsEnabled ? styles.selected : ''}
            ${effectsEnabled ? styles.hover : ''}
          `}
          onClick={() => handleSelect(index)}
        >
          <img
            key={index}
            src={image.src}
            alt={`Option ${index + 1}`}
            className={`${styles.image} ${flipped ? styles.flipped : ''}`}
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
