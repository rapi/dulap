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
import { FormattedMessage } from 'react-intl'
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
  predefinedValue?: string
}
export const mirroringOptions: ButtonOptionsType[] = [
  {
    value: 'standard',
    label: 'homepage.configurator.wardrobeArrangement.mirroring.options.1',
  },
  {
    value: 'mirrored',
    label: 'homepage.configurator.wardrobeArrangement.mirroring.options.2',
  },
]
export type ProductSectionPredefinedValue = {
  number?: number
  mirror?: string
  arrangement?: ImageOptionProps[]
  opening?: ImageOptionProps[]
}
interface ProductSelectProps {
  configuration: ProductSectionsComponent
  predefinedValue?: ProductSectionPredefinedValue
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
  predefinedValue,
}) => {
  const [minSections, setMinSections] = useState(String(minNumber))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<null | number>(null)
  const [selectedSections, setSelectedSections] = useState([...activeSections])
  selectedMirrorOption = selectedMirrorOption ?? 'standard'
  setSelectedMirrorOption = setSelectedMirrorOption ?? (() => {})
  const sections = new Array(maxNumber).fill(0).map((_, i) => ({
    value: String(i + 1),
    label: `homepage.configurator.sections.nr.${String(i + 1)}`,
  }))
  useEffect(() => {
    setSelectedSections(activeSections)
  }, [activeSections])
  useEffect(() => {
    setSelectedMaxSections(minNumber)
  }, [minNumber])
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
  const predefinedSections = predefinedValue ?? {}
  return (
    <>
      <div>
        <p className={styles.sectionTitle}>
          <FormattedMessage id="homepage.configurator.wardrobeArrangement.title" />
        </p>
        <label className={styles.sectionLabel}>
          <p>
            <FormattedMessage id="homepage.configurator.wardrobeArrangement.sectionsNr" />
          </p>
          {predefinedSections?.number ?? (
            <ButtonSelect
              options={formatedSections}
              defaultSelected={String(selectedMaxSections)}
              onChange={(value) => {
                setSelectedMaxSections(parseInt(value))
              }}
            />
          )}
        </label>

        <label className={styles.mirroringLabel}>
          <p>
            <FormattedMessage id="homepage.configurator.wardrobeArrangement.mirroring" />
          </p>
          {predefinedSections?.mirror ?? (
            <ButtonSelect
              options={mirroringOptions}
              defaultSelected={'standard'}
              onChange={(value) => {
                setSelectedMirrorOption(value)
              }}
            />
          )}
        </label>

        <label className={styles.sectionArrangementLabel}>
          <p>
            <FormattedMessage id="homepage.configurator.wardrobeArrangement.shelvesArrangement" />
          </p>
          <ImageSelect
            images={
              predefinedSections?.arrangement?.map(
                ({ src, width, height }) => ({ src, width, height })
              ) ?? selectedSections
            }
            onChange={(i) => {
              if (!predefinedSections?.arrangement) {
                setActiveSection(i)
                setIsModalOpen(true)
              }
            }}
            flipped={selectedMirrorOption === 'mirrored'}
            defaultSelected={1}
            effectsEnabled
          />
        </label>

        <label className={styles.sectionArrangementLabel}>
          <p>
            <FormattedMessage id="homepage.configurator.wardrobeArrangement.doorsArrangement" />
          </p>
          <ImageSelect
            images={
              predefinedSections?.opening?.map(({ src, width, height }) => ({
                src,
                width,
                height,
              })) ?? activeOpening
            }
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
          <FormattedMessage id="homepage.configurator.wardrobeArrangement.shelvesArrangement.modal.title" />
        </p>
        <div className={styles.imageSelectContainer}>
          <ImageSelect
            gap={10}
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
