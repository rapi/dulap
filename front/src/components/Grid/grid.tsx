import React from 'react'
import styles from './grid.module.css'
import { CustomButton } from '../CustomButton/CustomButton'

interface GridProps {
  images: { src: string }[]
  href: string
}

const Grid: React.FC<GridProps> = ({ images, href }) => {
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
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              marginTop: '8px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <video autoPlay loop muted playsInline className={styles.video}>
              <source src={images[2].src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '30px',
                zIndex: 1,
              }}
            >
              <CustomButton size="medium" variant="danger" href={href}>
                Configure it
              </CustomButton>
            </div>
          </div>
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

export default Grid
