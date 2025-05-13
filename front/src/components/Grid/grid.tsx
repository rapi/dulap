import React from 'react'
import styles from './grid.module.css'

interface GridProps {
  images: { src: string }[];
}
  
const Grid: React.FC<GridProps> = ({ images }) => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.row}>
        <div className={styles.column}>
            <img 
                src={images[0].src} alt='Image 1' loading="lazy" 
            />
            <img 
                src={images[1].src} alt='Image 1' loading="lazy" 
            />
        </div>
        <div className={styles.column}>
            <img 
                src={images[2].src} alt='Image 1' loading="lazy" 
            />
            <img 
                src={images[3].src} alt='Image 1' loading="lazy" 
            />
            <img 
                src={images[4].src} alt='Image 1' loading="lazy" 
            />
        </div>
      </div>
    </div>
  );
};

export default Grid;
