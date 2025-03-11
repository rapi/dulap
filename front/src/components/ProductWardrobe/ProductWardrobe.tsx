import * as React from 'react';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const wardrobeOptions: ButtonOptionsType[] = [
  { value: '1 secție', label: '1' },
  { value: '2 secții', label: '2' },
  { value: '3 secții', label: '3' },
  { value: '4 secții', label: '4' },
]

export const ProductWardrobe = () => {
  const [furniture1, setFurniture1] = React.useState('');

  const handleChangeFurniture1 = (event: SelectChangeEvent) => {
    setFurniture1(event.target.value);
  };

  const [furniture2, setFurniture2] = React.useState('');

  const handleChangeFurniture2 = (event: SelectChangeEvent) => {
    setFurniture2(event.target.value);
  };

  return (
    <>
      {/* Left Side: Image */}
      <div className={styles.leftContainer}>
        <div className={styles.imageContainer}>
          <img
            src="/products/wardrobe-visualization/2.jpg"
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
      <div className={styles.rightContainer}>
        <h1 className={styles.title}>Dulap pentru haine</h1>
        <ButtonSelect
          options={wardrobeOptions}
          defaultSelected={'2 secții'}
          onChange={() => {}}
        />
        {/* Dimensions Sliders */}
        <div className={styles.dimensions}>
          <p className={styles.subtitle}>Dimensiuni</p>
          <div className={styles.dimensionsGrid}>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Lățime</p>
              <Slider
                min={30}
                max={100}
                step={1}
                value={100}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Înălțime</p>
              <Slider
                min={180}
                max={240}
                step={10}
                value={210}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Adâncime</p>
              <Slider
                min={45}
                max={70}
                step={1}
                value={50}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
          </div>
        </div>

        {/* Color Selection */}
        <div className={styles.colorsContainer}>
          <p className={styles.subtitle}>Culori</p>
          <SelectColor
            colors={['#eeeeee', '#b5b5b5', '#d7d0c5']}
            onChange={() => {}}
            defaultSelected={'#eeeeee'}
            size="medium"
          />
        </div>

        {/* Furniture Options */}
        <div className={styles.furnitureContainer}>
          <p className={styles.subtitle}>Furnitura</p>
          <label className={styles.furnitureLabel}>
            <p>Balamale</p>
            {/* <Select options={['Standard', 'Premium', 'Deluxe']} /> */}
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">alege</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={furniture1}
                label="Age"
                onChange={handleChangeFurniture1}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Standard</MenuItem>
                <MenuItem value={20}>Premium</MenuItem>
                <MenuItem value={30}>Deluxe</MenuItem>
              </Select>
            </FormControl>
          </label>
          <label className={styles.furnitureLabel}>
            <p>Glisiere</p>
            {/* <Select options={['Standard (cu bile)', 'Premium', 'Deluxe']} /> */}
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">alege</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={furniture2}
                label="Age"
                onChange={handleChangeFurniture2}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Standard</MenuItem>
                <MenuItem value={20}>Premium</MenuItem>
                <MenuItem value={30}>Deluxe</MenuItem>
              </Select>
            </FormControl>
          </label>
        </div>

        {/* Shelf Arrangement (Dropdowns for Sections) */}
        <div className={styles.shelfArrangement}>
          <p className={styles.subtitle}>Aranjare rafturi</p>
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
      </div>
    </>
  )
}
