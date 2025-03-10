import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import { Slider } from '~/components/Slider/Slider'
import SelectColor from '~/components/SelectColor/SelectColor'
import { ImageSelect } from '~/components/ImageSelect/ImageSelect'
import Select from '~/components/Select/Select'
import React from 'react'

export const wardrobeOptions: ButtonOptionsType[] = [
  {
    value: '1 secție',
    label: (
      <>
        <img src="/products/wardrobe.jpg" height={20} /> 1 secție
      </>
    ),
  },
  { value: '2 secții', label: '2 secții' },
  { value: '3 secții', label: '3 secții' },
  { value: '4 secții', label: '4 secții' },
]

export const ProductWardrobe = () => {
  return (
    <>
      {/* Left Side: Image */}
      <div className={styles.imagePriceContainer}>
        <div className={styles.imageContainer}>
          <img
            src="/products/wardrobe-visualization/1.png"
            alt="Wardrobe"
            className={styles.image}
          />
        </div>
        <div className={styles.priceContainer}>
          <div className={styles.priceTitle}>
            <h4>Calculator de preț:</h4>
          </div>
          <div className={styles.price}>
            <h2>6850 MDL</h2>
          </div>
          <div className={styles.addToCartButtonContainer}>
            <CustomButton
              icon={<ShoppingCartIcon />}
              size="large"
              // outlined
              variant="danger"
            >
              Adaugă în coș
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Right Side: Product Details */}
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>Dulap pentru haine</h1>
        <ButtonSelect
          options={wardrobeOptions}
          defaultSelected={'2 secții'}
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
            defaultSelected={1}
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
    </>
  )
}
