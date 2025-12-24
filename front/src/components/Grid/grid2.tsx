import React from 'react'
import styles from './grid.module.css'

interface GridProps {
  images: { src: string }[]
  href: string
}

const Grid2: React.FC<GridProps> = ({ images }) => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.row}>
        <div className={styles.column}>
          <img
            src={images[0].src}
            alt="Image 1"
            loading="lazy"
            className={styles.image}
          />
          <img
            src={images[1].src}
            alt="Image 1"
            loading="lazy"
            style={{ flexGrow: 1 }}
          />
        </div>
        <div className={styles.column}>
        <img
            src={images[2].src}
            alt="Image 1"
            loading="lazy"
            style={{ flexGrow: 1 }}
          />
          <img src={images[3].src} alt="Image 1" loading="lazy" />
          <img
            src={images[4].src}
            alt="Image 1"
            loading="lazy"
            style={{ flexGrow: 1 }}
          />
        </div>
      </div>
    </div>
  )
}

export default Grid2
