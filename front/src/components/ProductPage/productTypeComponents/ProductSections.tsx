import React, { FC, useState } from 'react'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { wardrobeOptions } from '~/components/ProductWardrobe/ProductWardrobe'
import { ImageSelect } from '~/components/ImageSelect/ImageSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { Modal } from '~/components/Modal/Modal'
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
        <p>Aranjare dulap</p>
        <label>
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

        <label>
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
        <h2 className={styles.title}>
          Alege aranjarea rafturilor pentru Secțiunea 3
        </h2>
        <div>
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
      </Modal>
    </>
  )
}
