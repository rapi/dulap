import React, { useState } from 'react'
import styles from './ProductPage.module.css'
import { Breadcrumb } from '~/components/Breadcrumb/Breadcrumb'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { Slider } from '~/components/Slider/Slider'
import SelectColor from '~/components/SelectColor/SelectColor'
import { ImageSelect } from '~/components/ImageSelect/ImageSelect'
import Select from '~/components/Select/Select'

export const ProductPage: React.FC = () => {
  const [sections, setSections] = useState(3)
  const [dimensions, setDimensions] = useState({
    width: 2425,
    height: 2300,
    depth: 560,
  })
  const [color, setColor] = useState('standard-white')
  const [hinges, setHinges] = useState('standard')
  const [sliders, setSliders] = useState('standard')

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
        <div className={styles.imageContainer}>
          <img src="/wardrobe.jpg" alt="Wardrobe" className={styles.image} />
        </div>

        {/* Right Side: Product Details */}
        <div className={styles.detailsContainer}>
          <h1 className={styles.title}>Dulap pentru haine</h1>

          <ButtonSelect
            options={['Option 1', 'Option 2', 'Option 3']}
            defaultSelected={'Option 1'}
            onChange={() => {}}
          />
          {/* Dimensions Sliders */}
          <div className={styles.dimensions}>
            <label className={styles.dimensionLabel}>
              Lățime (mm) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Slider
                min={1000}
                max={5000}
                step={5}
                value={100}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
            <label className={styles.dimensionLabel}>
              Înălțime (mm)&nbsp;&nbsp;&nbsp;&nbsp;
              <Slider
                min={1000}
                max={5000}
                step={5}
                value={100}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
            <label className={styles.dimensionLabel}>
              Adâncime (mm)
              <Slider
                min={1000}
                max={5000}
                step={5}
                value={100}
                onChange={(newValue) => console.log(newValue)}
              />
            </label>
          </div>

          {/* Color Selection */}
          <div className={styles.colors}>
            <h3>Culori</h3>
            <SelectColor
              colors={['#eeeeee', '#b5b5b5', '#d7d0c5']}
              onChange={() => {}}
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
            <label className={styles.furnitureLabel}>
              Balamale:
              <Select options={['Standard', 'Premium', 'Deluxe']} />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
