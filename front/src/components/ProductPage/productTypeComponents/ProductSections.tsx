import React, { FC, useEffect, useState } from 'react'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import {
  ImageOptionProps,
  ImageSelect,
} from '~/components/ImageSelect/ImageSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { Modal } from '~/components/Modal/Modal'
import { CustomButton } from '~/components/CustomButton/CustomButton'
export type ProductSectionsComponent = {
  type: 'sections'
  maxNumber: number
  minNumber: number
  onSelect?: (section: number) => void
  possibleSections: ImageOptionProps[]
  sectionWidths: string[]
}
interface ProductSelectProps {
  configuration: ProductSectionsComponent
}
export const ProductSections: FC<ProductSelectProps> = ({
  configuration: { possibleSections, maxNumber, minNumber },
}) => {
  const [selectedMaxSections, setSelectedMaxSections] = useState(
    String(maxNumber)
  )
  const [minSections, setMinSections] = useState(String(minNumber))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<null | number>(null)
  const [selectedSections, setSelectedSections] = useState([
    ...possibleSections,
  ])
  const sections = new Array(maxNumber).fill(0).map((_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }))
  useEffect(() => {
    const number = parseInt(selectedMaxSections)
    if (selectedSections.length > number) {
      setSelectedSections(selectedSections.slice(0, number))
    } else {
      console.log(selectedSections, [
        ...selectedSections,
        ...Array(number - selectedSections.length).fill(possibleSections[0]),
      ])
      setSelectedSections([
        ...selectedSections,
        ...Array(number - selectedSections.length).fill({
          src: possibleSections[0].src,
        }),
      ])
    }
  }, [selectedMaxSections])
  useEffect(() => {
    setSelectedMaxSections(String(maxNumber))
  }, [maxNumber])
  useEffect(() => {
    setMinSections(String(minNumber))
  }, [minNumber])
  const formatedSections: ButtonOptionsType[] = sections.map((section) => ({
    label: section.label,
    value: section.value,
    disabled: parseInt(section.value) < parseInt(minSections),
  }))
  return (
    <>
      <div>
        <p className={styles.sectionTitle}>Aranjare dulap</p>
        <label className={styles.sectionLabel}>
          <p>Numărul de secții</p>
          <ButtonSelect
            options={formatedSections}
            defaultSelected={selectedMaxSections}
            onChange={(value) => setSelectedMaxSections(value)}
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

        <label className={styles.sectionArrangementLabel}>
          <p>Aranjare uși</p>
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
            gap={15}
            images={possibleSections}
            defaultSelected={0}
            onChange={(i) => {
              if (activeSection !== null && i !== null) {
                const newSections = [...selectedSections]
                setSelectedSections(newSections)
                setActiveSection(null)
              }
              setIsModalOpen(false)
            }}
          />
        </div>
        <div className={styles.modalSaveButton}>
          <CustomButton variant="primary" size="small">
            Salvează
          </CustomButton>
        </div>
      </Modal>
    </>
  )
}
