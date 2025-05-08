import React, { FC, useState } from 'react'
import { Slider } from '~/components/Slider/Slider'
import { ButtonOptionsType, ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { Modal } from '~/components/Modal/Modal'

export type ProductDimensionsComponent = {
  type: 'dimensions'
  widthRange: [number, number]
  heightRange: [number, number]
  width: number
  setWidth: (value: number) => void
  height: number
  setHeight: (value: number) => void
}
export const widthOptions: ButtonOptionsType[] = [
  { value: '800', label: '80 cm' },
  { value: '1000', label: '100 cm' },
]
interface ProductDimensionsProps {
  configuration: ProductDimensionsComponent
}

export const ProductDimensions: FC<ProductDimensionsProps> = ({
  configuration,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <h3 className={styles.dimensionsHeaderTitle}>Dimensiuni</h3>
      <div className={styles.dimensionsGrid}>
      <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Înălțime </p>
          <Slider
            min={configuration.heightRange[0]}
            max={configuration.heightRange[1]}
            step={10}
            value={configuration.height}
            onChange={configuration.setHeight}
          />
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Lățime</p>
          <ButtonSelect
            options={widthOptions}
            defaultSelected={'800'}
            onChange={(value) => {
              configuration.setWidth(parseInt(value))
            }}
          />
        </label>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
          }}
        >   
          <h4>
            Ce este înălțimea plintei?
          </h4>
          <div className={styles.modalChildren}>
            <img 
              src='/wardrobe/base-tooltip.png' 
              alt='base tooltip' 
              className={styles.modalImg}
            ></img>
            <p className={styles.modalText}>
              Înălțimea plintei este distanța de la podea până la fațade (ușile dulapului). 
              <br></br>
              <br></br>
              <b>Ce înălțime să alegi?</b>
              <ul>
                <li>Dacă optezi pentru un stil minimalist, alege înălțimea plintei 2 cm.</li>
                <li>Dacă ai plinte la pereți, optează pentru o plintă de aceeași înălțime la dulap, pentru un design uniform.</li>
              </ul>
            </p>
          </div>
        </Modal>
      </div>
    </>
  )
}
