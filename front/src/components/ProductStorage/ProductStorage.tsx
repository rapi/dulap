import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  ButtonSelect,
  ButtonOptionsType,
} from '~/components/ButtonSelect/ButtonSelect'
import { Slider } from '~/components/Slider/Slider'
import SelectColor from '~/components/SelectColor/SelectColor'
import Select from '~/components/Select/Select'
import React from 'react'

const standOptions: ButtonOptionsType[] = [
  {
    value: '1x1',
    label: (
      <>
        <img alt="" src="/storage/1x1.svg" height={20} />
      </>
    ),
  },
  {
    value: '2x1',
    label: (
      <>
        <img alt="" src="/storage/2x1.svg" height={20} />
      </>
    ),
  },
  {
    value: '3x1',
    label: (
      <>
        <img alt="" src="/storage/3x1.svg" height={20} />
      </>
    ),
  },
  {
    value: '1x2',
    label: (
      <>
        <img alt="" src="/storage/1x2.svg" height={40} />
      </>
    ),
  },
  {
    value: '2x2',
    label: (
      <>
        <img alt="" src="/storage/2x2.svg" height={40} />
      </>
    ),
  },
  {
    value: '3x2',
    label: (
      <>
        <img alt="" src="/storage/3x2.svg" height={40} />
      </>
    ),
  },
  {
    value: '1x3',
    label: (
      <>
        <img alt="" src="/storage/1x3.svg" height={60} />
      </>
    ),
  },
  {
    value: '2x3',
    label: (
      <>
        <img alt="" src="/storage/2x3.svg" height={60} />
      </>
    ),
  },
  {
    value: '3x3',
    label: (
      <>
        <img alt="" src="/storage/3x3.svg" height={60} />
      </>
    ),
  },
]

export const ProductStorage = () => {
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
          </div>
          <div className={styles.price}>
            <h2>6850 MDL</h2>
          </div>
          <div className={styles.addToCartButtonContainer}>
            <CustomButton
              icon={<ShoppingCartIcon />}
              size="large"
              variant="danger"
            >
              Adaugă în coș
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Right Side: Product Details */}
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>Comodă</h1>
        <ButtonSelect
          options={standOptions}
          defaultSelected={'3 sertare'}
          onChange={() => {}}
        />
        {/* Dimensions Sliders */}
        <div className={styles.dimensions}>
          <h3>Dimensiuni</h3>
          <div className={styles.dimensionsGrid}>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Lățime (cm)</p>
              <Slider
                min={60}
                max={120}
                step={10}
                value={80}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Înălțime (cm)</p>
              <Slider
                min={80}
                max={150}
                step={10}
                value={120}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Adâncime (cm)</p>
              <Slider
                min={30}
                max={50}
                step={10}
                value={50}
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
