import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import InfoIcon from '@mui/icons-material/Info'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { Slider } from '~/components/Slider/Slider'
import SelectColor from '~/components/SelectColor/SelectColor'
import { ImageSelect } from '~/components/ImageSelect/ImageSelect'
import Select from '~/components/Select/Select'
import React from 'react'
import { wardrobeOptions } from '~/components/ProductWardrobe/ProductWardrobe'

export const ProductStand = () => {
  return (
    <>
      {/* Left Side: Image */}
      <div className={styles.imagePriceContainer}>
        <div className={styles.imageContainer}>
          <img
            src="/products/comoda-alba.jpg"
            alt="Wardrobe"
            className={styles.image}
          />
        </div>
        <div className={styles.priceContainer}>
          <div className={styles.priceTitle}>
            <h4>Calculator de preț:</h4>
            <button className={styles.infoButton}>
              <InfoIcon color="action" sx={{ fontSize: 20 }} />
            </button>
          </div>
          <div className={styles.price}>
            <h2>6850 MDL</h2>
          </div>
          <div className={styles.addToCartButtonContainer}>
            <CustomButton
              icon={<ShoppingCartIcon fontSize="large" />}
              size="large"
            >
              Adaugă în coș
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Right Side: Product Details */}
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>Dulap pentru haine</h1>
        {/* Shelf Arrangement (Dropdowns for Sections) */}
        <div className={styles.standVariations}>
          <ImageSelect
            images={[
              '/stand/comoda-3-sertare.svg',
              '/stand/comoda-4-sertare.svg',
              '/stand/comoda-5-sertare.svg',
            ]}
            onChange={() => {}}
            defaultSelected={1}
          />
        </div>
        <ButtonSelect
          options={wardrobeOptions}
          defaultSelected={'3 sertare'}
          onChange={() => {}}
        />
        {/* Dimensions Sliders */}
        <div className={styles.dimensions}>
          <h3>Dimensiuni</h3>
          <div className={styles.dimensionsGrid}>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Lățime (mm)</p>
              <Slider
                min={1000}
                max={5000}
                step={5}
                value={1000}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Înălțime (mm)</p>

              <Slider
                min={1000}
                max={5000}
                step={5}
                value={1000}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Adâncime (mm)</p>
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
            defaultSelected={'#eeeeee'}
            size="large"
          />
        </div>

        {/* Furniture Options */}
        <div className={styles.furniture}>
          <h3>Furnitura</h3>
          <label className={styles.furnitureLabel}>
            <p>Glisiere pentru sertare:</p>
            <Select options={['Standard (cu bile)', 'Premium', 'Deluxe']} />
          </label>
        </div>
      </div>
    </>
  )
}
