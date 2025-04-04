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
export type ProductSectionsComponent = {
  type: 'sections'
  maxNumber: number
  minNumber: number
  onSelect?: (section: number) => void
  possibleSections: ImageOptionProps[]
  activeSections: ImageOptionProps[]
  activeOpening: ImageOptionProps[]
  selectedMaxSections: number
  selectedSections: ImageOptionProps[]
  setSelectedMaxSections: (value: number) => void
  selectedMirrorOption?: string
  setSelectedMirrorOption?: (value: string) => void
}
export const mirroringOptions: ButtonOptionsType[] = [
  { value: 'standard', label: 'standard' },
  { value: 'mirrored', label: 'oglindit' },
]
interface ProductSelectProps {
  configuration: ProductSectionsComponent
}
export const ProductSections: FC<ProductSelectProps> = ({
  configuration: {
    possibleSections,
    maxNumber,
    minNumber,
    activeSections,
    activeOpening,
    selectedMaxSections,
    setSelectedMaxSections,
    selectedMirrorOption,
    setSelectedMirrorOption,
  },
}) => {
  const [minSections, setMinSections] = useState(String(minNumber))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<null | number>(null)
  const [selectedSections, setSelectedSections] = useState([...activeSections])
  selectedMirrorOption = selectedMirrorOption ?? 'standard'
  setSelectedMirrorOption = setSelectedMirrorOption ?? (() => {})
  const sections = new Array(maxNumber).fill(0).map((_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }))

  useEffect(() => {
    setSelectedMaxSections(maxNumber)
  }, [maxNumber])
  useEffect(() => {
    setMinSections(String(minNumber))
  }, [minNumber])
  useEffect(() => {
    const updatedSections = activeSections.map((section, index) => ({
      ...section,
      src: selectedSections[index]?.src || section.src,
    }))
    if (JSON.stringify(updatedSections) !== JSON.stringify(selectedSections)) {
      setSelectedSections(updatedSections)
    }
  }, [activeSections, selectedSections])
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
            defaultSelected={String(selectedMaxSections)}
            onChange={(value) => {
              setSelectedMaxSections(parseInt(value))
            }}
          />
        </label>

        <label className={styles.mirroringLabel}>
          <p>
            Inversare poziție <br></br>dulap
          </p>
          <ButtonSelect
            options={mirroringOptions}
            defaultSelected={'standard'}
            onChange={(value) => {
              setSelectedMirrorOption(value)
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
            flipped={selectedMirrorOption === 'mirrored'}
            defaultSelected={1}
            effectsEnabled
          />
        </label>

        <label className={styles.sectionArrangementLabel}>
          <p>Aranjare uși</p>
          <ImageSelect
            images={activeOpening}
            onChange={(i) => {
              setActiveSection(i)
            }}
            flipped={selectedMirrorOption === 'mirrored'}
            defaultSelected={8}
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
                const currentActiveSections = [...selectedSections]
                if (selectedMirrorOption === 'standard') {
                  currentActiveSections[activeSection].src =
                    possibleSections[i].src
                } else {
                  currentActiveSections[
                    currentActiveSections.length - activeSection - 1
                  ].src = possibleSections[i].src
                }
                setSelectedSections(currentActiveSections)
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
