import React, { FC, useState } from 'react'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { wardrobeOptions } from '~/components/ProductWardrobe/ProductWardrobe'
import { ImageSelect } from '~/components/ImageSelect/ImageSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { Modal } from '~/components/Modal/Modal'
import { CustomButton } from '~/components/CustomButton/CustomButton'
export type ProductSectionsComponent = {
  type: 'sections'
  maxNumber: number
  onSelect?: (section: number) => void
  possibleSections: string[]
}
interface ProductSelectProps {
  configuration: ProductSectionsComponent
}
export const ProductSections: FC<ProductSelectProps> = ({
  configuration: { possibleSections },
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<null | number>(null)
  const [selectedSections, setSelectedSections] = useState([
    ...possibleSections,
  ])
  return (
    <>
      <div>
        <p className={styles.sectionTitle}>Aranjare dulap</p>
        <label className={styles.sectionLabel}>
          <p>Numărul de secții</p>
          <ButtonSelect
            options={wardrobeOptions}
            defaultSelected={'4'}
            onChange={(value) => {
              const number = parseInt(value)
              if (selectedSections.length > number) {
                setSelectedSections(selectedSections.slice(0, number))
              } else {
                setSelectedSections([
                  ...selectedSections,
                  ...Array(number - selectedSections.length).fill(
                    possibleSections[0]
                  ),
                ])
              }
            }}
          />
        </label>

        <label className={styles.sectionArrangementLabel}>
          <p>Aranjare rafturi</p>
          <ImageSelect
            images={selectedSections}
            onChange={(i) => {
              setActiveSection(i)
              setIsModalOpen(true)
            }}
            defaultSelected={1}
          />
        </label>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
      >
        <p className={styles.subtitle}>
          Alege aranjarea rafturilor pentru Secțiunea 3
        </p>
        <div className={styles.imageSelectContainer}>
          <ImageSelect
            images={possibleSections}
            defaultSelected={0}
            onChange={(i) => {
              if (activeSection !== null && i !== null) {
                const newSections = [...selectedSections]
                newSections[activeSection] = possibleSections[i]
                setSelectedSections(newSections)
                setActiveSection(null)
              }
              setIsModalOpen(false)
            }}
          />
        </div>
        <div className={styles.modalSaveButton}>
          <CustomButton
            variant='primary'
            size='small'
          >
            Salvează
          </CustomButton>
        </div>        
      </Modal>
    </>
  )
}
