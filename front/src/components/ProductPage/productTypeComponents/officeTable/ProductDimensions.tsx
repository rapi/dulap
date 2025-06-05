import React, { FC, useState } from 'react'
import { ButtonOptionsType, ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { Modal } from '~/components/Modal/Modal'

export type ProductDimensionsComponent = {
  type: 'dimensions'
  dimension: string
  setDimension: (value: string) => void
}
export const dimensionsOptions: ButtonOptionsType[] = [
  { value: '1200x600', label: '120 x 60 cm' },
  { value: '1400x700', label: '140 x 70 cm' },
  { value: '1600x800', label: '160 x 80 cm' },
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
          <p className={styles.dimensionTitle}>Lungime x Adâncime</p>
          <ButtonSelect
            options={dimensionsOptions}
            defaultSelected={'1400x700'}
            onChange={(value) => {
              configuration.setDimension(value)
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
