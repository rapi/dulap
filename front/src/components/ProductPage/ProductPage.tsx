import React from 'react'
import styles from './ProductPage.module.css'
import { Breadcrumb } from '~/components/Breadcrumb/Breadcrumb'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { Slider } from '~/components/Slider/Slider'
import SelectColor from '~/components/SelectColor/SelectColor'
import { ImageSelect } from '~/components/ImageSelect/ImageSelect'
import Select from '~/components/Select/Select'
import InfoIcon from '@mui/icons-material/Info';

export const ProductPage: React.FC = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Category', link: '#' },
          { label: 'subcategory', link: '#' },
          { label: 'Dulap pentru haine' },
        ]}
      />
      <div className={styles.container}>
        {/* Left Side: Image */}
        <div className={styles.imagePriceContainer}>
          <div className={styles.imageContainer}>
            <img src="/wardrobe.jpg" alt="Wardrobe" className={styles.image} />
          </div>
          <div className={styles.priceContainer}>
            <div className={styles.priceTitle}>
              <h4>Calculator de preț:</h4>
              <button className={styles.infoButton}>
                  <InfoIcon 
                    color='action'
                    sx={{ fontSize: 20 }}
                  />
              </button>
            </div>
            <div className={styles.price}>
              <h2>6850 MDL</h2>
            </div>
          </div>
        </div>
        

        {/* Right Side: Product Details */}
        <div className={styles.detailsContainer}>
          <h1 className={styles.title}>Dulap pentru haine</h1>

          <ButtonSelect
            options={['2 secții', '3 secții', '4 secții']}
            defaultSelected={'2 secții'}
            onChange={() => {}}
          />
          {/* Dimensions Sliders */}
          <div className={styles.dimensions}>
            <h3>Dimensiuni</h3>
            <div className={styles.dimensionsGrid}>
              <label className={styles.dimensionLabel}>
                Lățime (mm) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Slider
                  min={1000}
                  max={5000}
                  step={5}
                  value={1000}
                  onChange={(newValue) => console.log(newValue)}
                />
              </label>
              <label className={styles.dimensionLabel}>
                Înălțime (mm)&nbsp;&nbsp;&nbsp;&nbsp;
                <Slider
                  min={1000}
                  max={5000}
                  step={5}
                  value={1000}
                  onChange={(newValue) => console.log(newValue)}
                />
              </label>
              <label className={styles.dimensionLabel}>
                Adâncime (mm)
                <Slider
                  min={1000}
                  max={5000}
                  step={5}
                  value={1000}
                  onChange={(newValue) => console.log(newValue)}
                />
              </label>
            </div>
          </div>

          {/* Color Selection */}
          <div className={styles.colors}>
            <h3>Culori</h3>
            <SelectColor
              colors={['#eeeeee', '#b5b5b5', '#d7d0c5']}
              onChange={() => {}}
              size='large'
            />
          </div>

          {/* Shelf Arrangement (Dropdowns for Sections) */}
          <div className={styles.shelfArrangement}>
            <h3>Aranjare rafturi</h3>
            <ImageSelect
              images={[
                '/wardeobe/1.svg',
                '/wardeobe/2.svg',
                '/wardeobe/3.svg',
                '/wardeobe/4.svg',
              ]}
              onChange={() => {}}
            />
          </div>

          {/* Furniture Options */}
          <div className={styles.furniture}>
            <h3>Furnitura</h3>
            <label className={styles.furnitureLabel}>
              <p>Balamale:</p>
              <Select options={['Standard', 'Premium', 'Deluxe']} />
            </label>
            <label className={styles.furnitureLabel}>
              <p>Glisiere pentru sertare:</p>
              <Select options={['Standard (cu bile)', 'Premium', 'Deluxe']} />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
