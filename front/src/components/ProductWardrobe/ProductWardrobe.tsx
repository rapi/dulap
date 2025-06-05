import * as React from 'react'
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
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

export const wardrobeOptions: ButtonOptionsType[] = [
  { value: '1', label: 'homepage.configurator.sections.nr.1' },
  { value: '2', label: 'homepage.configurator.sections.nr.2' },
  { value: '3', label: 'homepage.configurator.sections.nr.3' },
  { value: '4', label: 'homepage.configurator.sections.nr.4' },
]
export const openingOptions: ButtonOptionsType[] = [
  { value: 'maner', label: 'mâner' },
  { value: 'push', label: 'push-to-open' },
]

export const ProductWardrobe = () => {
  const [furniture1, setFurniture1] = React.useState('')

  const handleChangeFurniture1 = (event: SelectChangeEvent) => {
    setFurniture1(event.target.value)
  }

  const [furniture2, setFurniture2] = React.useState('')

  const handleChangeFurniture2 = (event: SelectChangeEvent) => {
    setFurniture2(event.target.value)
  }

  return (
    <>
      {/* Left Side: Image */}
      <div className={styles.leftContainer}>
        <div className={styles.imageContainerFirstRow}>
          <img
            src="/[locale]/products.tsx/wardrobe-visualization/2.jpg"
            alt="Wardrobe"
            className={styles.image}
          />
        </div>
        <div className={styles.imageContainerSecondRow}>
          <div className={styles.imageContainer2}>
            <img
              src="/[locale]/products.tsx/wardrobe-visualization/2.jpg"
              alt="Wardrobe"
              className={styles.image}
            />
          </div>
          <div className={styles.imageContainer2}>
            <img
              src="/[locale]/products.tsx/wardrobe-visualization/2.jpg"
              alt="Wardrobe"
              className={styles.image}
            />
          </div>
        </div>
      </div>

      {/* Right Side: Product Details */}
      <div className={styles.rightContainer}>
        <h1 className={styles.title}>Dulap pentru haine</h1>

        {/* Dimensions Sliders */}
        <div className={styles.dimensions}>
          <p className={styles.subtitle}>Dimensiuni</p>
          <div className={styles.dimensionsGrid}>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Lățime</p>
              <div className={styles.dimensionsSliderContainer}>
                <Slider
                  min={30}
                  max={100}
                  step={1}
                  value={100}
                  onChange={(newValue) => console.log(newValue)}
                />
              </div>
            </label>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Înălțime</p>
              <div className={styles.dimensionsSliderContainer}>
                <Slider
                  min={180}
                  max={240}
                  step={10}
                  value={210}
                  onChange={(newValue) => console.log(newValue)}
                />
              </div>
            </label>
            <label className={styles.dimensionLabel}>
              <p className={styles.dimensionTitle}>Adâncime</p>
              <div className={styles.dimensionsSliderContainer}>
                <Slider
                  min={45}
                  max={70}
                  step={1}
                  value={50}
                  onChange={(newValue) => console.log(newValue)}
                />
              </div>
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

          <label className={styles.sectionsLabel}>
            <p>Tip deschidere</p>
            <ButtonSelect
              options={openingOptions}
              defaultSelected={'maner'}
              onChange={() => {}}
            />
          </label>

          <label className={styles.furnitureLabel}>
            <p>Balamale</p>
            <FormControl
              sx={{
                m: 1,
                minWidth: 120,
                margin: '0',
                backgroundColor: '#fff',
                height: '35px',
              }}
              size="small"
            >
              <Select
                value={furniture1}
                onChange={handleChangeFurniture1}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{
                  fontSize: '12px',
                  fontFamily: 'onest',
                  color: '#333',
                }}
              >
                <MenuItem
                  value=""
                  sx={{
                    fontSize: '12px',
                    fontFamily: 'onest',
                  }}
                >
                  standard
                </MenuItem>
                <MenuItem
                  value="premium"
                  sx={{
                    fontSize: '12px',
                    fontFamily: 'onest',
                  }}
                >
                  premium
                </MenuItem>
                <MenuItem
                  value="deluxe"
                  sx={{
                    fontSize: '13px',
                  }}
                >
                  deluxe
                </MenuItem>
              </Select>
            </FormControl>
          </label>
          <label className={styles.furnitureLabel}>
            <p>Glisiere</p>
            <FormControl
              sx={{
                m: 1,
                minWidth: 120,
                margin: '0',
                backgroundColor: '#fff',
              }}
              size="small"
            >
              <Select
                value={furniture2}
                onChange={handleChangeFurniture2}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{
                  fontSize: '12px',
                  fontFamily: 'onest',
                  color: '#333',
                }}
              >
                <MenuItem
                  value=""
                  sx={{
                    fontSize: '12px',
                    fontFamily: 'onest',
                  }}
                >
                  standard
                </MenuItem>
                <MenuItem
                  value="premium"
                  sx={{
                    fontSize: '12px',
                    fontFamily: 'onest',
                  }}
                >
                  premium
                </MenuItem>
                <MenuItem
                  value="deluxe"
                  sx={{
                    fontSize: '13px',
                  }}
                >
                  deluxe
                </MenuItem>
              </Select>
            </FormControl>
          </label>
        </div>

        {/* Shelf Arrangement (Dropdowns for Sections) */}
        <div className={styles.wardrobeArrangement}>
          <p className={styles.subtitle}>Aranjare dulap</p>
          <label className={styles.sectionsLabel}>
            <p>Numărul de secții test</p>
            <ButtonSelect
              options={wardrobeOptions}
              defaultSelected={'4 secții'}
              onChange={() => {}}
            />
          </label>

          <label className={styles.shelfArrangement}>
            <p className="">Aranjare rafturi</p>
            <ImageSelect
              images={[
                { src: '/wardeobe/1.svg' },
                { src: '/wardeobe/2.svg' },
                { src: '/wardeobe/3.svg' },
                { src: '/wardeobe/4.svg' },
              ]}
              onChange={() => {}}
              defaultSelected={1}
            />
          </label>
        </div>

        {/* Price container */}
        <div className={styles.priceContainer}>
          <div className={styles.priceFirstColumn}>
            <div className={styles.priceTitle}>
              <h4>Calculator de preț:</h4>
            </div>
            <div className={styles.price}>
              <h2>6850 MDL</h2>
            </div>
          </div>
          <div className={styles.priceSecondColumn}>
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
      </div>
    </>
  )
}
